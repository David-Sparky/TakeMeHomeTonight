angular.module('tmht')
.controller('signUpCtrl', ['$scope', '$http', '$window', '$uibModal', function($scope, $http, $window, $modal){


	$http({
		method: 'GET',
		url: 'signUp?returnTo=/%23/signUp'
	}).then(function(data){
		console.log(data);
		$window.location = data.data;

	}).catch(function(err){
		alert(err);
	});
	
	$scope.signUp = function(userData) {
		console.log(userData);
		$http({
			method: "POST",
			data: userData,
			url: '/user/signUp'
		})
		.then(function(data){
			console.log(data);
			
			$window.location = data.data;
		},
		function(err){
			alertModal(err.status, err.data);
		})
	}


	alertModal = function(title, body){
		$scope.modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'client/views/alert.html',
            controller: ['$scope', function(scope) {
                scope.cancel = $scope.cancel;
                scope.title = title;
              	scope.body = body;
            }]
        });
	};
	
}]);