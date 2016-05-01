angular.module('tmht')
.controller('userSettingsCtrl', ['$scope', 'rideService', '$uibModal', function($scope, rideService, $modal){

	$scope.offeredRides = [];
	$scope.requestedRides = [];
	$scope.offerForNeededDriver = [];

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
		$scope.offerForNeededDriver = data.data;
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
		}).catch(function(err){
			alertModal(err.status, err.data);
		});
	}

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