angular.module('tmht')
.service('rideService', ['$http', 'Upload', function($http, Upload){
	this.rideFormSubmit = function(formData, option){
		return $http({
			method: "POST",
			data: formData,
			url: option
		});
	};

	this.getUserSettingInfo = function(){
		return $http({
			method: "GET",
			url: 'user/getUserSettingsInfo'
		});
	};

	this.editUserSettings = function(userInfo){
		console.log(userInfo);
		return $http({
			method: "PUT",
			url: 'user/editUserSettings',
			data: userInfo
		});
	};

	this.getAllRequestedRides = function(){
		return $http({
			method: 'GET',
			url: 'rides/allRequestedRides'
		});
	};

	this.getAllOfferedRides = function(){
		return $http({
			method: 'GET',
			url: 'rides/allOfferedRides'
		});
	};
}]);