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

	this.getOfferRide = function(id){
		//console.log(id);
		return $http({
			method: "GET",
			url: 'rides/get_offer?id='+id
		});
	};
	this.getRide = function(id){
		//console.log(id);
		return $http({
			method: "GET",
			url: 'rides/get_ride?id='+id
		});
	};
	this.joinOffer = function(id,user){
		//console.log(id);
		return $http({
			method: "PUT",
			url: 'rides/join_offer',
			data: {id:id,user:user}
		});
	};
	this.joinRequest = function(id,user){
		//console.log(id);
		return $http({
			method: "PUT",
			url: 'rides/join_request',
			data: {id:id,user:user}
		});
	};
}]);