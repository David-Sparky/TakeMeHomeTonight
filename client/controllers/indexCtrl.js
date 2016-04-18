angular.module('tmht')
.controller('indexCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	
	$scope.logout = function(){
		$http({
			method: 'GET',
			url: 'logout'
		})
		.then(function(data){
			console.log(data);
			$window.location = data.data;
		},
		function(err){
			console.log(err);
		});
	};
	
}]);