angular.module('tmht')
.controller('rides', ['$scope','$location', 'rideService', function($scope, $location, rideService){

	if($location.path() == '/rides/ridesOffered'){
		$scope.title = 'Rides Available';
		$scope.needed = false;
		$scope.ridesavail = true;
		rideService.getAllOfferedRides().then(function(data){
			console.log(data);
			$scope.offerarray = data.data;
		}).catch(function(err){
			console.log(err);
		})
	} else if($location.path() == "/rides/ridesNeeded"){
		$scope.title = "Rides Needed";
		$scope.needed = true;
		$scope.ridesavail = false;
		rideService.getAllRequestedRides().then(function(data){
			//console.log(data);
			$scope.needarray = data.data;
		}).catch(function(err){
			console.log(err);
		})
		
	}else if($location.path() == "/rides/ride"){
		$scope.title = "Ride"
	}else if($location.path() == "/rides/offer"){
		$scope.title = "Offer";
	}
}]);	