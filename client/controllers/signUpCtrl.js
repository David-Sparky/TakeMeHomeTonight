// Sign Up Controller
angular.module('tmht')
.controller('signUpCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	// Sign Up Function
	$scope.signUp = function(userData) {
		$http({
			method: "POST",
			data: userData,
			url: '/user/signUp'
		})
		.then(function(data){
			$window.location = data.data;
		},
		// Alert if there is an error
		function(err){
			sweetAlert("Oops...", "There was an error! "+err.data, "error");
		})
	}
	
}]);