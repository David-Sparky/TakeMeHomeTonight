var app = angular.module('tmht', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'loginCtrl'
	}).
	when('/landing', {
		templateUrl: 'client/views/landing.html',
		controller: 'landingCtrl'
	}).
	when('/ridesOffered', {
		templateUrl: 'client/views/rides.html',
		controller: 'rides'
	}).
	when('/ridesNeeded', {
		templateUrl: 'client/views/rides.html',
		controller: 'rides'
	}).
	when('/requestRide', {
		templateUrl: 'client/views/ridesForm.html',
		controller: 'rideFormCtrl'
	}).
	when('/addRide', {
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