var app = angular.module('tmht', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'loginCtrl'
	}).
	when('/landing', {
		templateUrl: 'client/views/landing.html',
		controller: 'logoutCtrl'
	}).
	when('/rides', {
		templateUrl: 'client/views/rides.html',
		controller: 'offerRides'
	}).
	when('/ridesneeded', {
		templateUrl: 'client/views/riders.html',
		controller: 'needRides'
	}).
	otherwise({
		redirectTo: '/'
	})
}]);