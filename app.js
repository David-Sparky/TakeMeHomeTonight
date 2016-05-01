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
		controller: 'teamCtrl'
	}).
	when('/publicTransit', {
		templateUrl: 'client/views/publicTransit.html'
	}).
	when('/taxi', {
		templateUrl: 'client/views/taxi.html',
		controller: 'taxiCtrl'
	}).
	when('/plane', {
		templateUrl: 'client/views/plane.html',
		controller: 'planeCtrl'
	}).
	when('/bus', {
		templateUrl: 'client/views/bus.html'
	}).
	when('/train', {
		templateUrl: 'client/views/train.html'
	}).
	when('/shuttle', {
		templateUrl: 'client/views/shuttle.html'
	}).
	when('/publicTrans', {
		templateUrl: 'client/views/publicTrans.html',
		controller: 'publicTransitCtrl'
	}).
	when('/publicTrans', {
		templateUrl: 'client/views/publicTrans.html',
		controller: 'publicTransitCtrl'
	}).
	otherwise({
		redirectTo: '/'
	})


}]);
	
app.run(['$rootScope', '$location', '$route', 'AuthService', function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.$$route != undefined && next.$$route.access.restricted && (AuthService.getUserStatus() == undefined || AuthService.getUserStatus() == '')) {
      $location.path('/');
    }
  });
}]);