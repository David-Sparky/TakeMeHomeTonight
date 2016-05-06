angular.module('tmht')
.service('rideService', ['$http', function($http){ // this is the rideService that is call with the userSettingsCtrl - it does the all of the requests to the server
	this.rideFormSubmit = function(formData, option){
		return $http({
			method: "POST",
			data: formData,
			url: option
		});
	};

	this.getUserSettingInfo = function(){ // these are mostly self explanatory - this is getitng the users setting information
		return $http({
			method: "GET",
			url: 'user/getUserSettingsInfo'
		});
	};

	this.editUserSettings = function(userInfo){ // passes the userInfo to the back end.
		return $http({
			method: "PUT",
			url: 'user/editUserSettings',
			data: userInfo
		});
	};

	this.getAllRequestedRides = function(){ // gets all requested rides
		return $http({
			method: 'GET',
			url: 'rides/allRequestedRides'
		});
	};

	this.getAllOfferedRides = function(){ // get all offered rides
		return $http({
			method: 'GET',
			url: 'rides/allOfferedRides'
		});
	};

	this.getOfferRide = function(id){ // get a specific ride offer by id
		return $http({
			method: "GET",
			url: 'rides/get_offer?id='+id
		});
	};
	this.getRide = function(id){ // get a specific ride request by id
		return $http({
			method: "GET",
			url: 'rides/get_ride?id='+id
		});
	};
	this.joinOffer = function(id,user){ // join the offer offer that is passed in.
		return $http({
			method: "PUT",
			url: 'rides/join_offer',
			data: {id:id,user:user}
		});
	};


	this.getOfferedRidesPerUser = function(){ // get the offered rides that the user has offered/
		return $http({
			method: 'GET',
			url: '/rides/offeredRidesPerUser'
		});
	};

	this.getRequestedRidesPerUser = function(){ // get the requested rides that the user has requested
		return $http({
			method: 'GET',
			url: '/rides/requestedRidesPerUser'
		});
	};

	this.confirmRider = function(rideID, user){ // confirm the rider - by changing the status to accepted
		return $http({
			method: 'PUT',
			url:'/rides/confirmRider',
			data: {rideID: rideID, rcs: user}
		});
	};

	this.removeRider = function(rideID, user){ // remove the ride that was passed in - this is for ride offers
		return $http({
			method: 'DELETE',
			url: '/rides/removeRider?rideID=' + rideID + '&rcs=' + user
		});
	};

	this.removeDriver = function(rideID, user){ // remove the driver that was passed in - this is for ride requests
		return $http({
			method: 'DELETE',
			url: '/rides/removeDriver?rideID='+ rideID + '&rcs=' + user
		});
	};

	this.removeRideOffer = function(rideID){ // this removes a ride offer completely - it takes in an id and passes it to the back end. the ones below do all the same thing, just a little more specifically
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

	this.confirmDriver = function(rideID, user){ // add a driver
		return $http({
			method: 'PUT',
			url: '/rides/confirmDriver',
			data: {rideID: rideID, rcs: user}
		});
	};

	this.getOfferForNeededRidesDriver = function(){ // gets all of the riders where the current user offered to be the driver
		return $http({
			method: 'GET',
			url: '/rides/offersForNeededRidesDriver'
		});
	};

	this.getOfferForNeededRidesRider = function(){ // get all of the rides where the current user is asking to be a rider
		return $http({
			method: 'GET',
			url: '/rides/offersForNeededRidesRider'
		});
	};

	this.joinRequest = function(id,user){ // join a users ride request - as a driver
		return $http({
			method: "PUT",
			url: 'rides/join_request',
			data: {id:id,user:user}
		});
	};

	this.removePendingRider = function(rideID, user){ // removes a pending user from a ride id.
		return $http({
			method: 'DELETE',
			url: '/rides/removePendingRider?rideID=' + rideID + '&rcs=' + user
		});
	};

}]);