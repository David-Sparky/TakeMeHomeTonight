var app = angular.module('tmht', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'client/views/home.html',
		controller: 'loginCtrl'
	}).
	when('/landing', {
		templateUrl: 'client/views/landing.html'
	}).
	otherwise({
		redirectTo: '/'
	})
}]);