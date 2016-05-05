// Ride Form Controller
angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', 'rideService', function($scope, $location, rideService){
	// Set default variables
	$scope.rideInfo = {};

	// If form is adding a ride
	if($location.path() == '/rides/addRide'){
		$scope.title = 'Add A Ride';
		$scope.add = true;
		rideService.getUserSettingInfo().then(function(data){
			$scope.rideInfo.car = data.data.car;
		}).catch(function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		});
	}
	// If form is requesting a ride
	else {
		$scope.title = 'Request A Ride';
		$scope.add = false;
	}

	// Submit function
	$scope.submit = function(){
		rideService.rideFormSubmit($scope.rideInfo, $location.path()).then(function(data){
			sweetAlert("Success!!","Your ride offer has been submitted!","success");
		},
		function(err){
			sweetAlert("Error!","Your ride offer has not been submitted! "+ err.data,"error");
		})
	};
	
}]);