	var app = angular.module('tmht', ['ui.bootstrap', 'ngRoute', 'ngFileUpload', 'ngCookies']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'loginCtrl',
		access: {restricted: false}
	}).
	when('/signUp', {
		templateUrl: 'client/views/signUp.html',
		controller: 'signUpCtrl',
		access: {restricted: false}

	}).
	when('/userSettings', {
		templateUrl: 'client/views/userSettings.html',
		controller: 'userSettingsCtrl',
		access: {restricted: true}
	}).
	when('/landing', {
		templateUrl: 'client/views/landing.html',
		controller: 'landingCtrl',
		access: {restricted: true}
	}).
	when('/rides/ridesOffered', {
		templateUrl: 'client/views/rides.html',
		controller: 'rides',
		access: {restricted: true}
	}).
	when('/rides/ridesNeeded', {
		templateUrl: 'client/views/rides.html',
		controller: 'rides',
		access: {restricted: true}
	}).
	when('/rides/requestRide', {
		templateUrl: 'client/views/ridesForm.html',
		controller: 'rideFormCtrl',
		access: {restricted: true}
	}).
	when('/rides/addRide', {
		templateUrl: 'client/views/ridesForm.html',
		controller: 'rideFormCtrl',
		access: {restricted: true}
	}).
	when('/rides/ride', {
		templateUrl: 'client/views/ridePage.html',
		controller: 'ridePage',
		access: {restricted: true}
	}).
	when('/rides/offer', {
		templateUrl: 'client/views/ridePage.html',
		controller: 'ridePage',
		access: {restricted: true}
	}).
	when('/team', {
		templateUrl: 'client/views/team.html',
		controller: 'teamCtrl',
		access: {restricted: false}
	}).
	when('/publicTransit', {
		templateUrl: 'client/views/publicTransit.html',
		controller: 'publicTransitCtrl',
		access: {restricted: true}
	}).
	when('/taxi', {
		templateUrl: 'client/views/taxi.html',
		controller: 'taxiCtrl',
		access: {restricted: true}
	}).
	when('/plane', {
		templateUrl: 'client/views/plane.html',
		controller: 'planeCtrl',
		access: {restricted: true}
	}).
	when('/bus', {
		templateUrl: 'client/views/bus.html',
		access: {restricted: true}
	}).
	when('/shuttle', {
		templateUrl: 'client/views/shuttle.html',
		access: {restricted: true}
	}).

	// when('/publicTrans', {
	// 	templateUrl: 'client/views/publicTrans.html',
	// 	controller: 'publicTransitCtrl'
	// }).
	// when('/publicTrans', {
	// 	templateUrl: 'client/views/publicTrans.html',
	// 	controller: 'publicTransitCtrl'
	// }).
	// when('/buses', {
	// 	templateUrl: 'client/views/buses.html',
	// 	controller: 'busesCtrl'
	// }).


	otherwise({
		redirectTo: '/'
	})


}]);

app.run(['$rootScope', '$window', '$route', 'AuthService', function ($rootScope, $window, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
  	AuthService.checkSessionStatus().then(function(data){
  		if (next.$$route != undefined && (next.$$route.access == undefined || next.$$route.access.restricted) && !data.data) {
	      AuthService.removeUser();
	      alert("You are not authorize or not logged in");
	      $window.location = '/';
	      //swal("Oops..", "You are not logged in/authorized", "error");
	    }
  	}).catch(function(err){
  		console.log(err);
  		alert(err);
  	});
  });
}]);

