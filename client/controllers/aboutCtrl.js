angular.module('tmht')
.controller('rideFormCtrl', ['$scope','$location', function($scope, $location){

	if($location.path() == '/about-us'){
		$scope.title = 'About Us';
		$scope.add = true;
	}

	function(err){
			console.log(err);
		});

}]);