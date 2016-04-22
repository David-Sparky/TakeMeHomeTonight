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
	when('/aboutUs', {
		templateUrl: 'client/views/about-us.html',
		access: {restricted: false}
	}).
	otherwise({
		redirectTo: '/'
	})


}]);

/*
app.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
  function (event, next, current) {
    if (next.access.restricted && AuthService.getUserStatus() == undefined) {
      $location.path('/');
      console.log('shit')
      $route.reload();
    }
  });
});
*/
app.run(['$rootScope', '$location', '$route', 'AuthService', function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
  	console.log(next.$$route);
    if (next.$$route != undefined && next.$$route.access.restricted && AuthService.getUserStatus() == undefined) {
      $location.path('/');
      console.log('shit');
    }
  });
}]);