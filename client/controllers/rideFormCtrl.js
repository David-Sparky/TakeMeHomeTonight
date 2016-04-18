angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', 'rideService', function($scope, $location, rideService){

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
		},
		function(err){
			console.log(err);
		});
	}

	
}]);