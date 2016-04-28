angular.module('tmht')
.controller('rides', ['$scope','$location', 'rideService', function($scope, $location, rideService){

	switch($location.path()){
		case '/rides/ridesOffered':
			$scope.title = 'Rides Available';
			$scope.needed = false;
			$scope.ridesavail = true;
			rideService.getAllOfferedRides().then(function(data){
				console.log(data);
				$scope.offerarray = data.data;
			}).catch(function(err){
				console.log(err);
			});
			break;
		case "/rides/ridesNeeded":
			$scope.title = "Rides Needed";
			$scope.needed = true;
			$scope.ridesavail = false;
			rideService.getAllRequestedRides().then(function(data){
				//console.log(data);
				$scope.needarray = data.data;
			}).catch(function(err){
				console.log(err);
			});
			break;
		case "/rides/ride":
			$scope.title = "Ride";
			break;
		case "/rides/offer":
			$scope.title = "Offer";
			break;
	}
}]);	