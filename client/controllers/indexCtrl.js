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

	$('.nav a').on('click', function(){
	    $('.btn-navbar').click(); //bootstrap 2.x
	    $('.navbar-toggle').click() //bootstrap 3.x by Richard
	});
}]);