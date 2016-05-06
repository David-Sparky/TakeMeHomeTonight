angular.module('tmht')
.controller('userSettingsCtrl', ['$scope', 'rideService', 'AuthService', function($scope, rideService, AuthService){

	$scope.offeredRides = [];//basic arrays used in the page. These are updated as more information comes in.
	$scope.requestedRides = [];
	$scope.neededRidesDriver = [];
	$scope.neededRidesRider = [];

	rideService.getUserSettingInfo().then(function(data){ // this returns the basic user setting information, such as name and car
		$scope.editUser = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	rideService.getOfferedRidesPerUser().then(function(data){ // this returns all offered rides by the current users
		$scope.offeredRides = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	rideService.getOfferForNeededRidesDriver().then(function(data){ // this returns all rides where the user rquested they would drive.
		$scope.neededRidesDriver = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	rideService.getOfferForNeededRidesRider().then(function(data){ // this returns all rides where the user is the rider.
		$scope.neededRidesRider = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});


	rideService.getRequestedRidesPerUser().then(function(data){ // this returns all rides that the current user is requesting
		$scope.requestedRides = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	$scope.save = function(formData){ // basic save function where it pushes the data in the fields to the databse - then alerts.
		rideService.editUserSettings(formData).then(function(data){
			sweetAlert("Success!","Your changes were saved successfully!","success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.confirmRider = function(rideID, user){ // this confirms a user as a rider, it subtracts the available seats by 1 and adjusts the status to accpeted.
		rideService.confirmRider(rideID, user).then(function(data){
			for(x in $scope.offeredRides){
				if($scope.offeredRides[x]._id == rideID){
					for(y in $scope.offeredRides[x].riders){
						if($scope.offeredRides[x].riders[y].rcs == user){
							$scope.offeredRides[x].riders[y].status = 'accepted';
							$scope.offeredRides[x].availableseats = $scope.offeredRides[x].availableseats - 1;
							break;
						}
					}
				}
			}
			sweetAlert("Success!","Successfully confirmed "+user,"success"); // if everything goes well it was successful and alert - otherwise alert fail
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.removeRider = function(rideID, user){ // this will remove the selected rider from the ride offer
		swal({ // alert to ensure that the user wants to delete the rider.
			title: "You sure you want to delete this rider?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete them!",
			closeOnConfirm: false
		},
		function(){ // do the deleting
			rideService.removeRider(rideID, user).then(function(data){ // call the rideServer remove rider function, and pass the ride id and user.
				for(x in $scope.offeredRides){
					if($scope.offeredRides[x]._id == rideID){
						for(y in $scope.offeredRides[x].riders){
							if($scope.offeredRides[x].riders[y].rcs == user){ // adds a available seat and splice the user out of the array.
								if($scope.offeredRides[x].riders[y].status == 'accepted'){
									$scope.offeredRides[x].availableseats = $scope.offeredRides[x].availableseats + 1;
									$scope.offeredRides[x].riders.splice(y, 1);
									break;
								}
								else{
									$scope.offeredRides[x].riders.splice(y, 1);
									break;
								}
							}
						}
					}
				}
				sweetAlert("Success!","Successfully removed "+user,"success"); // if eveyrthing succeeded then alert otherwise alert there was ana error
			}).catch(function(err){
				sweetAlert("Error!","There was an error! "+err.data,"error");
			});
		})
	};

	$scope.removePendingRider = function(rideID, user){ // this removes a user that is pending instead of one that is accepted. The main difference is that it does not increase the amount of available users
		rideService.removePendingRider(rideID, user).then(function(data){
			for(x in $scope.offeredRides){
				if($scope.offeredRides[x]._id == rideID){
					for(y in $scope.offeredRides[x].riders){
						if($scope.offeredRides[x].riders[y].rcs == user){
							$scope.offeredRides[x].riders.splice(y, 1);
							break;
						}
					}
				}
			}
			sweetAlert("Success!","Successfully removed "+user,"success"); // alert - must inform the user it was successful!
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};
	
	$scope.removeDriver = function(rideID, user){ // this is for requests not offers and removes the accepted driver.
		swal({
			title: "You sure you want to delete this driver?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete them!",
			closeOnConfirm: false
		},
		function(){ // basic alert to ensure and then remove the user. In the removeDriver of the rideService it sets the ride to not accpeted allowing it to be displayed for users to request to be the driver
			rideService.removeDriver(rideID, user).then(function(data){
				for(x in $scope.neededRidesRider){
					if($scope.neededRidesRider[x]._id == rideID){
						for(y in $scope.neededRidesRider[x].drivers){
							if($scope.neededRidesRider[x].drivers[y].rcs == user){
								$scope.neededRidesRider[x].drivers.splice(y, 1);
								break;
							}
						}
					}
				}
				sweetAlert("Success!","Successfully removed "+user,"success");
			}).catch(function(err){
				sweetAlert("Error!","There was an error! "+err.data,"error");
			});
		});
	};


	$scope.confirmDriver = function(rideID, user){ // adds a user as the confirmed driver - set the status to be accepted as well
		rideService.confirmDriver(rideID, user).then(function(data){
			console.log(data);
			for(x in $scope.neededRidesRider){
				if($scope.neededRidesRider[x]._id == rideID){
					$scope.neededRidesRider[x].accepted = true;
					for(y in $scope.neededRidesRider[x].drivers){
						if($scope.neededRidesRider[x].drivers[y].rcs == user){
							$scope.neededRidesRider[x].drivers[y].status = 'accepted';
							break;
						}
					}
				}
			}
			sweetAlert("Success!","Successfully confirmed "+user,"success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.removeRideOffer = function(rideID){ // delete a rider offer - alert and then do it.
		swal({
			title: "Are you sure you want to remove this ride offer?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
		},
		function(){
			rideService.removeRideOffer(rideID).then(function(data){
				for(var x in $scope.offeredRides){
					if(rideID == $scope.offeredRides[x]._id){
						$scope.offeredRides.splice(x, 1);
					}
				}
				sweetAlert("Success!","Successfully removed your ride offer!","success");
			}).catch(function(err){
				sweetAlert("Error!","There was an error! "+err.data,"error");
			});
		});
	};

	$scope.removeNeededRide = function(rideID){ // remove a request for a ride - alert and do it as well
		swal({
			title: "Are you sure you want to remove this ride?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
		},
		function(){
			rideService.removeNeededRide(rideID).then(function(data){
				for(var x in $scope.neededRidesRider){
					if(rideID == $scope.neededRidesRider[x]._id){
						$scope.neededRidesRider.splice(x, 1);
					}
				}
				sweetAlert("Success!","Successfully removed your ride request!","success");
			}).catch(function(err){
				sweetAlert("Error!","There was an error! "+err.data,"error");
			});
		});
	}

	$scope.removeNeededRideOfferDriver = function(rideID){  // remove the ride what was requested and where you are the driver.
		swal({
			title: "Are you sure you want to remove this offer?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
		},
		function(){
			rideService.removeNeededRideOfferDriver(rideID).then(function(data){ //do the actual removal
				for(x in $scope.neededRidesDriver){
					if($scope.neededRidesDriver[x]._id == rideID){
						$scope.neededRidesDriver.splice(x, 1);
					}
				}
				sweetAlert("Success!","Successfully removed this ride offer!","success");
			}).catch(function(err){
				sweetAlert("Error!","There was an error! "+err.data,"error");
			});
		});
	};

	$scope.removeRequestForAvailableRide = function(rideID){ // remove the users requst for available rides - alert and then for the removal
		swal({
			title: "Are you sure you want to remove this request?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false
		},
		function(){
			rideService.removeRequestForAvailableRide(rideID).then(function(data){
				for(x in $scope.requestedRides){
					if(rideID == $scope.requestedRides[x]._id){
						$scope.requestedRides.splice(x, 1);
					}
				}
				sweetAlert("Success!","Successfully removed your ride request!","success");
			}).catch(function(err){
				sweetAlert("Error!","There was an error! "+err.data,"error");
			});
		});
	};

}]);