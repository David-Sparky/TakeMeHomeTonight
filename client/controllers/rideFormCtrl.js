angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', function($scope, $location){
	
	

	if($location.path() == '/addRide'){
		$scope.title = 'Add A Ride';
		$scope.add = true;
	}
	else{
		$scope.title = 'Request A Ride';
		$scope.add = false;
	}
	console.log($scope.rideForm);

	$scope.submit = function(){
		console.log($scope.rideInfo);
	}

	
}]);