angular.module('tmht')
.controller('signUpCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

	$scope.signUp = function(userData) {
		console.log(userData);
		$http({
			method: "POST",
			data: userData,
			url: '/user/signUp'
		})
		.then(function(data){
			console.log(data);
			$window.location = data.data;
		},
		function(err){
			alert(err.data);
		})
	}
	
}]);