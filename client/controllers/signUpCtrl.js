angular.module('tmht')
.controller('signUpCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

	/*
	$http({
		method: 'GET',
		url: 'signUp?returnTo=/%23/signUp'
	}).then(function(data){
		$window.location = data.data;

	}).catch(function(err){
		sweetAlert("Oops...", "There was an error! "+err.data, "error");
	});*/
	
	$scope.signUp = function(userData) {
		$http({
			method: "POST",
			data: userData,
			url: '/user/signUp'
		})
		.then(function(data){
			$window.location = data.data;
		},
		function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		})
	}
	
}]);