var app = angular.module('tmht', ['ui.bootstrap', 'ngRoute', 'ngFileUpload']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'loginCtrl'
	}).
	when('/signUp', {
		templateUrl: 'client/views/signUp.html',
		controller: 'signUpCtrl'
	}).
	when('/userSettings', {
		templateUrl: 'client/views/userSettings.html',
		controller: 'userSettingsCtrl'
	}).
	when('/landing', {
		templateUrl: 'client/views/landing.html',
		controller: 'landingCtrl'
	}).
	when('/rides/ridesOffered', {
		templateUrl: 'client/views/rides.html',
		controller: 'rides'
	}).
	when('/rides/ridesNeeded', {
		templateUrl: 'client/views/rides.html',
		controller: 'rides'
	}).
	when('/rides/requestRide', {
		templateUrl: 'client/views/ridesForm.html',
		controller: 'rideFormCtrl'
	}).
	when('/rides/addRide', {
		templateUrl: 'client/views/ridesForm.html',
		controller: 'rideFormCtrl'
	}).
	when('/aboutUs', {
		templateUrl: 'client/views/about-us.html'
	}).
	otherwise({
		redirectTo: '/'
	})
}]);