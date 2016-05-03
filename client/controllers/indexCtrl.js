angular.module('tmht')
.controller('indexCtrl', ['$scope', '$http', '$window','AuthService','socket', function($scope, $http, $window, AuthService, socket){
	
	$scope.logout = AuthService.logout;
	$scope.notifications = AuthService.getNotifications();

	$scope.checkForUser = function(){
		var user = AuthService.getUserStatus();
		if( user == undefined || user == ''){
			return false;
		}
		else{
			return true;
		}
	};

	socket.on('join', function(data){
		console.log(data);
	});	
	if($scope.checkForUser == true){
		socket.emit('logged in');
	}
	socket.emit('logged in');
	socket.on('notifications', function(data){
		AuthService.setNotifications(data.notifications);
		$scope.notifications = data.notifications;
		console.log(data);
	});

	socket.on('notification', function(data){
		console.log(data);
		socket.emit('update notifications');
	});
	//socket.on()


	$(document).ready(function () {
		$("nav").find("li").on("click", "a", function () {
	        $('.navbar-collapse.in').collapse('hide');
    	});
    });

	
}]);