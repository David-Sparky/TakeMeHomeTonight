angular.module('tmht')
.controller('logoutCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
	$scope.logout = function(){
		$http({
			method: 'GET',
			url: 'logout'
		})
		.then(function(data){
			console.log(data);
			$window.location = "https://cas-auth.rpi.edu/cas/logout";
		},
		function(err){
			console.log(err);
		});
	};
}]);