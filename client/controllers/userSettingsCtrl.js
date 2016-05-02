angular.module('tmht')
.controller('userSettingsCtrl', ['$scope', 'rideService', '$uibModal','AuthService', function($scope, rideService, $modal, AuthService){

	$scope.offeredRides = [];
	$scope.requestedRides = [];
	$scope.neededRidesDriver = [];
	$scope.neededRidesRider = [];

	rideService.getUserSettingInfo().then(function(data){
		$scope.editUser = data.data;
	}).catch(function(err){
		alertModal(err.status, err.data);
	});

	rideService.getOfferedRidesPerUser().then(function(data){
		$scope.offeredRides = data.data;
	}).catch(function(err){
		alertModal(err.status, err.data);
	});

	rideService.getOfferForNeededRidesDriver().then(function(data){
		$scope.neededRidesDriver = data.data;
	}).catch(function(err){
		alertModal(err.status, err.data);
	});

	rideService.getOfferForNeededRidesRider().then(function(data){
		$scope.neededRidesRider = data.data;
		console.log(data);
		//$scope.acceptedDrivers = data.data.accepted;
		//$scope.pendingDrivers = data.data.pending;
		console.log(data.data);
	}).catch(function(err){
		alertModal(err.status, err.data);
	});


	rideService.getRequestedRidesPerUser().then(function(data){
		console.log(data);
		$scope.requestedRides = data.data;
	}).catch(function(err){
		alertModal(err.status, err.data);
	});

	$scope.save = function(formData){
		rideService.editUserSettings(formData).then(function(data){
			console.log(data);
			alertModal('User Settings', data.data);
		}).catch(function(err){
			alertModal(err.status, err.data);
			console.log(err);
		});
	};

	$scope.confirmRider = function(rideID, user){
		rideService.confirmRider(rideID, user).then(function(data){
			console.log(data);
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
		}).catch(function(err){
			alertModal(err.status, err.data);
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
		}).catch(function(err){
			alertModal(err.status, err.data);
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
		}).catch(function(err){
			alertModal(err.status, err.data);
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
		}).catch(function(err){
			alertModal(err.status, err.data);
		});
	};

	$scope.removeRideOffer = function(rideID){
		rideService.removeRideOffer(rideID).then(function(data){
			console.log(data);
			for(var x in $scope.offeredRides){
				if(rideID == $scope.offeredRides[x]._id){
					$scope.offeredRides.splice(x, 1);
				}
			}
		}).catch(function(err){
			alertModal(err.status, err.data);
		});
	};

	$scope.removeNeededRide = function(rideID){
		rideService.removeNeededRide(rideID).then(function(data){
			console.log(data);
			for(var x in $scope.neededRidesRider){
				if(rideID == $scope.neededRidesRider[x]._id){
					$scope.neededRidesRider.splice(x, 1);
					alert('confirmed');
				}
			}
		}).catch(function(err){
			alertModal(err.status, err.data);
		});
	}

	$scope.removeNeededRideOfferDriver = function(rideID){
		rideService.removeNeededRideOfferDriver(rideID).then(function(data){
			console.log(data);
			for(x in $scope.neededRidesDriver){
				if($scope.neededRidesDriver[x]._id == rideID){
					$scope.neededRidesDriver.splice(x, 1);
				}
			}
			alert('deleted');
		}).catch(function(err){
			alertModal(err.status, err.data);
		});
	};

	$scope.removeRequestForAvailableRide = function(rideID){
		rideService.removeRequestForAvailableRide(rideID).then(function(data){
			for(x in $scope.requestedRides){
				if(rideID == $scope.requestedRides[x]._id){
					$scope.requestedRides.splice(x, 1);
					alert(data.data);
				}
			}
		}).catch(function(err){
			alertModal(err.status, err.data);
		});
	};

	alertModal = function(title, body){
		$scope.modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'client/views/alert.html',
            controller: ['$scope', function(scope) {
                scope.cancel = $scope.cancel;
                scope.title = title;
              	scope.body = body;
            }]
        });
	};

}])