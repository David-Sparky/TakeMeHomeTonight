angular.module('tmht')
.service('rideService', ['$http', 'Upload', function($http, Upload){
	this.rideFormSubmit = function(formData, option){
		return $http({
			method: "POST",
			data: formData,
			url: option
		});
	};

}]);