angular.module('tmht')
.controller('userSettingsCtrl', ['$scope', 'rideService', function($scope, rideService){

	rideService.getUserSettingInfo().then(function(data){
		console.log(data);
		$scope.editUser = data.data;
	}).catch(function(err){
		alert(err.data);
	});

	$scope.save = function(formData){
		rideService.editUserSettings(formData).then(function(data){
			console.log(data);
		}).catch(function(err){
			console.log(err);
		});
	};



}])