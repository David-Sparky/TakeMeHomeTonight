// Login Controller
angular.module('tmht')
.controller('loginCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
	// Login function
	$scope.login = function(){
		$http({
			method: 'GET',
			url: 'login?returnTo=/%23/landing'
		}).then(function(data){
			$window.location = data.data;
		},
		// If cant login and there is an error
		function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		});
	};
	
	// Sign up function
	$scope.signUp = function(){
		$http({
			method: 'GET',
			url: 'signUp?returnTo=/%23/signUp'
		}).then(function(data){
			$window.location = data.data;
		}).catch(function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		});
	}

}]);