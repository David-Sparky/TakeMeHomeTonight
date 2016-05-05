angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', 'rideService', function($scope, $location, rideService){

	$scope.rideInfo = {};

	if($location.path() == '/rides/addRide'){
		$scope.title = 'Add A Ride';
		$scope.add = true;
		rideService.getUserSettingInfo().then(function(data){
			$scope.rideInfo.car = data.data.car;
		}).catch(function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		});
	}
	else{
		$scope.title = 'Request A Ride';
		$scope.add = false;
	}



	$scope.submit = function(){
		rideService.rideFormSubmit($scope.rideInfo, $location.path()).then(function(data){
			sweetAlert("Success!!","Your ride offer has been submitted!","success");
		},
		function(err){
			sweetAlert("Error!","Your ride offer has not been submitted! "+ err.data,"error");
		})
	};
	
}]);