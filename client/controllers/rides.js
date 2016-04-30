angular.module('tmht')
.controller('rides', ['$scope','$location', 'rideService','$cookies','$filter', function($scope, $location, rideService,$cookies,$filter,$compile){
	$scope.joined = false;
	switch($location.path()){
		case '/rides/ridesOffered':
			$scope.title = 'Rides Available';
			$scope.needed = false;
			$scope.ridesavail = true;
			rideService.getAllOfferedRides().then(function(data){
				//console.log(data);
				$scope.offerarray = data.data;
			}).catch(function(err){
				console.log(err);
			});
			break;
		case "/rides/ridesNeeded":
			$scope.title = "Rides Needed";
			$scope.needed = true;
			$scope.ridesavail = false;
			rideService.getAllRequestedRides().then(function(data){
				//console.log(data);
				$scope.needarray = data.data;
			}).catch(function(err){
				console.log(err);
			});
			break;
		case "/rides/ride":
			$scope.title = "Ride";
			$scope.offer = false;
			$scope.ride = true;
			var ride_id = $location.search();
			rideService.getRide(ride_id.id).then(function(data){
				console.log(data);
			}).catch(function(err){
				console.log(err);
			});
			break;
		case "/rides/offer":
			$scope.title = "Offer";
			$scope.offer = true;
			$scope.ride = false;
			$scope.cookieusername = $cookies.get('user');
			var offer_id = $location.search();
			rideService.getOfferRide(offer_id.id).then(function(data){
				console.log(data);
				var offer = data.data;
				$scope.rcs = offer[0].owner;
				$scope.depart_local = offer[0].departLocation;
				$scope.depart_time = offer[0].departDate;
				$scope.destination = offer[0].destination;
				$scope.seats_avil = offer[0].availableseats;
				$scope.total_seats = offer[0].seats;
				$scope.car_make = offer[0].car.make;
				$scope.car_model = offer[0].car.model;
				$scope.car_license = offer[0].car.license;
				$scope.car_color = offer[0].car.color;
				$scope.total_array = offer[0].riders;
				$scope.pendingarray = [];
				$scope.acceptedarray = [];
				console.log($scope.cookieusername);
				if($scope.cookieusername == $scope.rcs){
					$scope.owner = true;
				}else{
					$scope.owner = false;
				}
				for(var i=0;i<$scope.total_array.length;i++){
					var entry = $scope.total_array[i];
					if(entry.status == "pending"){
						console.log(entry.rcs + " PENDING");
						$scope.pendingarray.push(entry);
					}else{
						console.log(entry.rcs + " ACCEPTED");
						$scope.acceptedarray.push(entry);
					}
				}
			}).catch(function(err){
				console.log(err);
			});
			break;
	}
	$scope.join_offer = function(){
		var offer_id = $location.search();
		rideService.joinOffer(offer_id.id,$cookies.get('user')).then(function(data) {
		}).catch(function(err){
			console.log(err);
		});
		$scope.joined=true;
	};

	$scope.owner_and_available_check = function(){
		var found = $filter('filter')($scope.total_array,{rcs:$scope.cookieusername},true);
		if(found.length){
			return false;
		}else{
			if($scope.seats_avil  == 0){
				console.log("No seats");
				return false;
			}else if($scope.owner == true){
				console.log("Owner");
				return false;
			}else {
				return true;
			}
		}
	};

	$scope.add_user = function(user){
		console.log(user);
		$scope.acceptedarray.push({rcs:user,status:"accepted"});
		for(var i=0;i<$scope.pendingarray.length;i++) {
			if($scope.pendingarray[i].rcs == user){
				$scope.pendingarray.splice(i,1);
			}
		}

		//need to edit the user from "pending" to "accepted"
		//need to remove them from the "pending" array and add to the "accepted"
	};

	$scope.reject_user = function(user){
		console.log(user);
		for(var i=0;i<$scope.pendingarray.length;i++){
			if($scope.pendingarray[i].rcs == user ){
				$scope.pendingarray.splice(i,1);
			}
		}
	}

	$scope.remove_user = function(user){
		console.log(user);
		for(var i=0;i<$scope.acceptedarray.length;i++) {
			if($scope.acceptedarray[i].rcs == user){
				$scope.acceptedarray.splice(i,1);
			}
		}
		//need to remove the user from the array in the DB
	}
}]);	