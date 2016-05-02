angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', 'rideService', '$uibModal', function($scope, $location, rideService, $modal){

	$scope.rideInfo = {};

	if($location.path() == '/rides/addRide'){
		$scope.title = 'Add A Ride';
		$scope.add = true;
		rideService.getUserSettingInfo().then(function(data){
			//console.log(data);
			$scope.rideInfo.car = data.data.car;
		}).catch(function(err){
			//alertModal(err.status, err.data);
			console.log(err);
		});
	}
	else{
		$scope.title = 'Request A Ride';
		$scope.add = false;
	}



	$scope.submit = function(){
		//console.log($scope.rideInfo);
		//console.log($location.path());
		rideService.rideFormSubmit($scope.rideInfo, $location.path()).then(function(data){
			sweetAlert("Success!!","Your ride offer has been submitted!","success");
			console.log(data);
		},
		function(err){
			sweetAlert("Error!","Your ride offer has not been submitted! "+ err.data,"error");
		})
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
	
}]);