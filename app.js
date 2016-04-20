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
	when('/publicTransit', {
		templateUrl: 'client/views/publicTransit.html'
	}).
	when('/taxi', {
		templateUrl: 'client/views/taxi.html',
		controller: 'taxiCtrl'
	}).
	when('/plane', {
		templateUrl: 'client/views/plane.html'
	}).
	when('/bus', {
		templateUrl: 'client/views/bus.html'
	}).
	when('/train', {
		templateUrl: 'client/views/train.html'
	}).
	otherwise({
		redirectTo: '/'
	})
}]);