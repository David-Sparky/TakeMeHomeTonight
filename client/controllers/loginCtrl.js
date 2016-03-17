angular.module('tmht')
.controller('loginCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
	$scope.login = function(){
		$http({
			method: 'GET',
			url: 'login'
		}).then(function(data){
			console.log(data);
			$window.location = 'https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Flocalhost%3A8005%2F%23%2Flanding&renew=false';
		},
		function(err){
			console.log(err);
		});
	};

}]);