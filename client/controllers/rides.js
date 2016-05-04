angular.module('tmht')
.controller('rides', ['$scope','$location', 'rideService','$cookies','$filter', function($scope, $location, rideService,$cookies,$filter){
	$scope.joined = false;
	switch($location.path()){
		case '/rides/ridesOffered':
			$scope.title = 'Rides Available';
			$scope.needed = false;
			$scope.ridesavail = true;
			rideService.getAllOfferedRides().then(function(data){
				$scope.offerarray = data.data;
			}).catch(function(err){
				sweetAlert("Oops...", "There was an error! "+err.data, "error");
			});
			break;
		case "/rides/ridesNeeded":
			$scope.title = "Rides Needed";
			$scope.needed = true;
			$scope.ridesavail = false;
			rideService.getAllRequestedRides().then(function(data){
				$scope.needarray = data.data;
			}).catch(function(err){
				sweetAlert("Oops...", "There was an error! "+err.data, "error")
			});
			break;
    }
}]);	