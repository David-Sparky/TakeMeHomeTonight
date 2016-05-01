angular.module('tmht')
.controller('indexCtrl', ['$scope', '$http', '$window','AuthService', function($scope, $http, $window, AuthService){
	
	$scope.logout = AuthService.logout;

	$scope.checkForUser = function(){
		var user = AuthService.getUserStatus();
		if( user == undefined || user == ''){
			return false;
		}
		else{
			return true;
		}
	};


	$(document).ready(function () {
		$("nav").find("li").on("click", "a", function () {
	        $('.navbar-collapse.in').collapse('hide');
    	});
    });

	
}]);