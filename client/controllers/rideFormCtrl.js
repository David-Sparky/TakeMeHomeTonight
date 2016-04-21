angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', 'rideService', '$uibModal', function($scope, $location, rideService, $modal){

	if($location.path() == '/rides/addRide'){
		$scope.title = 'Add A Ride';
		$scope.add = true;
	}
	else{
		$scope.title = 'Request A Ride';
		$scope.add = false;
	}

	$scope.submit = function(){
		console.log($scope.rideInfo);
		console.log($location.path());
		rideService.rideFormSubmit($scope.rideInfo, $location.path()).then(function(data){
			console.log(data);
			$scope.modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'client/views/alert.html',
	            controller: ['$scope', function(scope) {
	                scope.cancel = $scope.cancel;
	                scope.title = $scope.title;
	              	scope.body = data.data.Success;
	            }]
	        });
		},
		function(err){
			console.log(err);
		});
	}

	
}]);