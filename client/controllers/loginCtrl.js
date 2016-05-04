angular.module('tmht')
.controller('loginCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
	$scope.login = function(){
		$http({
			method: 'GET',
			url: 'login?returnTo=/%23/landing'
		}).then(function(data){
			$window.location = data.data;
		},
		function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		});
	};
	
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