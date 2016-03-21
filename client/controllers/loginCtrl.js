angular.module('tmht')
.controller('loginCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
	$scope.login = function(){
		$http({
			method: 'GET',
			url: 'login'
		}).then(function(data){
			console.log(data);
			$window.location = data.data;
		},
		function(err){
			console.log(err);
		});
	};

}]);