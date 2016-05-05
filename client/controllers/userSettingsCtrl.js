angular.module('tmht')
.controller('userSettingsCtrl', ['$scope', 'rideService', 'AuthService', function($scope, rideService, AuthService){

	$scope.offeredRides = [];
	$scope.requestedRides = [];
	$scope.neededRidesDriver = [];
	$scope.neededRidesRider = [];

	rideService.getUserSettingInfo().then(function(data){
		$scope.editUser = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	rideService.getOfferedRidesPerUser().then(function(data){
		$scope.offeredRides = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	rideService.getOfferForNeededRidesDriver().then(function(data){
		$scope.neededRidesDriver = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	rideService.getOfferForNeededRidesRider().then(function(data){
		$scope.neededRidesRider = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});


	rideService.getRequestedRidesPerUser().then(function(data){
		$scope.requestedRides = data.data;
	}).catch(function(err){
		sweetAlert("Error!","There was an error! "+err.data,"error");
	});

	$scope.save = function(formData){
		rideService.editUserSettings(formData).then(function(data){
			sweetAlert("Success!","Your changes were saved successfully!","success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.confirmRider = function(rideID, user){
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
			sweetAlert("Success!","Successfully confirmed "+user,"success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.removeRider = function(rideID, user){
		rideService.removeRider(rideID, user).then(function(data){
			for(x in $scope.offeredRides){
				if($scope.offeredRides[x]._id == rideID){
					for(y in $scope.offeredRides[x].riders){
						if($scope.offeredRides[x].riders[y].rcs == user){
							$scope.offeredRides[x].riders.splice(y, 1);
							$scope.offeredRides[x].availableseats = $scope.offeredRides[x].availableseats + 1;
							break;
						}
					}
				}
			}
			sweetAlert("Success!","Successfully removed "+user,"success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.removePendingRider = function(rideID, user){
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
			sweetAlert("Success!","Successfully removed "+user,"success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};
	
	$scope.removeDriver = function(rideID, user){
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
	};


	$scope.confirmDriver = function(rideID, user){
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

	$scope.removeRideOffer = function(rideID){
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
	};

	$scope.removeNeededRide = function(rideID){
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
	}

	$scope.removeNeededRideOfferDriver = function(rideID){
		rideService.removeNeededRideOfferDriver(rideID).then(function(data){
			for(x in $scope.neededRidesDriver){
				if($scope.neededRidesDriver[x]._id == rideID){
					$scope.neededRidesDriver.splice(x, 1);
				}
			}
			sweetAlert("Success!","Successfully removed your the driver!","success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

	$scope.removeRequestForAvailableRide = function(rideID){
		rideService.removeRequestForAvailableRide(rideID).then(function(data){
			for(x in $scope.requestedRides){
				if(rideID == $scope.requestedRides[x]._id){
					$scope.requestedRides.splice(x, 1);
				}
			}
			sweetAlert("Success!","Successfully removed your ride offer!","success");
		}).catch(function(err){
			sweetAlert("Error!","There was an error! "+err.data,"error");
		});
	};

}]);