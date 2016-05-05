// Index Controller
angular.module('tmht')
.controller('indexCtrl', ['$scope', '$http', '$window','AuthService','socket', function($scope, $http, $window, AuthService, socket){
	
	// Set default variables
	$scope.logout = AuthService.logout;
	$scope.notifications = AuthService.getNotifications();
	$scope.newNotifications = 0;

	// Check if user is logged in
	$scope.checkForUser = function(){
		var user = AuthService.getUserStatus();
		if( user == undefined || user == ''){
			return false;
		}
		else{
			return true;
		}
	};

	AuthService.checkSessionStatus().then(function(data){
		if(data.data == true){
		} 
		else {
			AuthService.removeUser();
		}
	});

	// Notification socket information
	socket.on('join', function(data){
	});	
	if ($scope.checkForUser == true) {
		socket.emit('logged in');
	}
	socket.emit('logged in');
	socket.on('notifications', function(data){
		AuthService.setNotifications(data.notifications);
		$scope.newNotifications = data.count;
		$scope.notifications = data.notifications;
	});

	socket.on('notification', function(data){
		socket.emit('update notifications');
	});

	// Check if there is notifications
	$scope.checkNotifications = function(){
		if($scope.newNotifications == 0){
			for(x in $scope.notifications){
				if($scope.notifications[x].seen == false){
					$scope.notifications[x].seen = true;
				}
			}
		}
		else {
			$scope.newNotifications = 0;
			socket.emit('notifications seen');
		}	
	}

	// When nav bar is collapsed and someone clicks on link, close nav bar
	$(document).ready(function () {
		$("nav").find("li").on("click", "a", function () {
	        $('.navbar-collapse.in').collapse('hide');
    	});
    });

}]);