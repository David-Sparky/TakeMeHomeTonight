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


	this.getOfferedRidesPerUser = function(){
		return $http({
			method: 'GET',
			url: '/rides/offeredRidesPerUser'
		});
	};

	this.getRequestedRidesPerUser = function(){
		return $http({
			method: 'GET',
			url: '/rides/requestedRidesPerUser'
		});
	};

	this.confirmRider = function(rideID, user){
		return $http({
			method: 'PUT',
			url:'/rides/confirmRider',
			data: {rideID: rideID, rcs: user}
		});
	};

	this.removeRider = function(rideID, user){
		return $http({
			method: 'DELETE',
			url: '/rides/removeRider?rideID=' + rideID + '&rcs=' + user
		});
	};

	this.removeDriver = function(rideID, user){
		return $http({
			method: 'DELETE',
			url: '/rides/removeDriver?rideID='+ rideID + '&rcs=' + user
		});
	};

	this.removeRideOffer = function(rideID){
		return $http({
			method: 'DELETE',
			url: '/rides/removeRideOffer?rideID='+ rideID
		});
	};

	this.removeNeededRide = function(rideID){
		return $http({
			method: 'DELETE',
			url: '/rides/removeNeededRide?rideID=' + rideID
		});
	};

	this.removeNeededRideOfferDriver = function(rideID){
		return $http({
			method: 'DELETE',
			url: '/rides/removeNeededRideOfferDriver?rideID=' + rideID
		});
	};

	this.removeRequestForAvailableRide = function(rideID){
		return $http({
			method: 'DELETE',
			url: '/rides/removeRequestForAvailableRide?rideID=' + rideID
		});
	};

	this.confirmDriver = function(rideID, user){
		return $http({
			method: 'PUT',
			url: '/rides/confirmDriver',
			data: {rideID: rideID, rcs: user}
		});
	};

	this.getOfferForNeededRidesDriver = function(){
		return $http({
			method: 'GET',
			url: '/rides/offersForNeededRidesDriver'
		});
	};

	this.getOfferForNeededRidesRider = function(){
		return $http({
			method: 'GET',
			url: '/rides/offersForNeededRidesRider'
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

	this.removePendingRider = function(rideID, user){
		return $http({
			method: 'DELETE',
			url: '/rides/removePendingRider?rideID=' + rideID + '&rcs=' + user
		});
	};

}]);