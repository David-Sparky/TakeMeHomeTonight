// Singular Ride Page Controller
angular.module('tmht')
    .controller('ridePage', ['$scope','$location', 'rideService','$cookies','$filter', function($scope, $location, rideService,$cookies,$filter){ // this is a specific rides page controller
        
        // Set default variables 
        $scope.joined = false;
        $scope.joined2= false;
        $scope.cookieusername = $cookies.get('user');

        switch($location.path()){
            // if ride is being requested
            case "/rides/ride":
                $scope.title = "Ride";
                $scope.offer = false;
                $scope.ride = true; // basic variables for showing different options
                var ride_id = $location.search();
                rideService.getRide(ride_id.id).then(function(data){
                    var ride = data.data;
                    $scope.ride_owner = ride[0].rcs; // sets all the basic info
                    $scope.depart_local = ride[0].departLocation;
                    $scope.depart_date = ride[0].departDate;
                    $scope.depart_time = ride[0].departTime;
                    $scope.destination = ride[0].destination;
                    $scope.drivers = ride[0].drivers;
                    $scope.pendingDrivers = [];
                    $scope.acceptedDriver = [];
                    $scope.cost = ride[0].cost;
                    for(var i=0;i<$scope.drivers.length;i++){ // if the user is pending add them to the pending array otherwise they are accepted
                        var entry = $scope.drivers[i];
                        if(entry.status == "pending"){
                            $scope.pendingDrivers.push(entry);
                        }else{
                            $scope.acceptedDriver.push(entry);
                        }
                    }
                    if($scope.cookieusername == $scope.ride_owner){ // if the current viewer is the owner then show them some options.
                        $scope.owner2  = true;
                    }else{
                        $scope.owner2 = false;
                    }
                    if($scope.acceptedDriver.length == 1){ // if the acceptedDriver array is 1 -meaning there is a driver - then change this bool so that it removes the request to join button
                        $scope.acceptedDriver_Bool = true;
                    }
                }).catch(function(err){
                    sweetAlert("Oops...", "There was an error! "+err.data, "error");
                });
                break;

            // if ride is being offered
            case "/rides/offer":
                $scope.title = "Offer";
                $scope.offer = true;
                $scope.ride = false;
                var offer_id = $location.search();
                rideService.getOfferRide(offer_id.id).then(function(data){ // again basic informaiton about a offered ride
                    var offer = data.data;
                    $scope.rcs = offer[0].owner;
                    $scope.depart_local = offer[0].departLocation;
                    $scope.depart_date = offer[0].departDate;
                    $scope.depart_time = offer[0].departTime;
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
                    $scope.cost = offer[0].cost;
                    if($scope.cookieusername == $scope.rcs){ // checking the ownership
                        $scope.owner = true;
                    }else{
                        $scope.owner = false;
                    }
                    for(var i=0;i<$scope.total_array.length;i++){ // pending and accepted array again
                        var entry = $scope.total_array[i];
                        if(entry.status == "pending"){
                            $scope.pendingarray.push(entry);
                        }else{
                            $scope.acceptedarray.push(entry);
                        }
                    }
                }).catch(function(err){
                    sweetAlert("Oops...", "There was an error! "+err.data, "error");
                });
                break;
        }
        
        $scope.join_offer = function(){ // if the join button was pressed on a ride roffer - alert the user they joined and do the joinOffer seriver
            var offer_id = $location.search();
            rideService.joinOffer(offer_id.id,$cookies.get('user')).then(function(data) {
                $scope.joined=true;
                sweetAlert("Joined!","Successfully requested to join!","success");
            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });

        };

        $scope.owner_and_available_check = function(){ // check multiple settings, specifrically that the owner is this user, that there is seats available
            var found = $filter('filter')($scope.total_array,{rcs:$scope.cookieusername},true);
            if(found != undefined) {
                if (found.length) {
                    return false;
                } else {
                    if ($scope.seats_avil == 0) {
                        return false;
                    } else if ($scope.owner == true) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        };

        $scope.add_user = function(user){ // confirm the rider that was pressed - updates the scope arrays so the page dynamically updates
            $scope.acceptedarray.push({rcs:user,status:"accepted"});
            $scope.seats_avil = $scope.seats_avil -1;
            for(var i=0;i<$scope.pendingarray.length;i++) {
                if($scope.pendingarray[i].rcs == user){
                    $scope.pendingarray.splice(i,1);
                }
            }
            var offer_id = $location.search();
            rideService.confirmRider(offer_id.id, user).then(function(data){ // actually does the updating
                sweetAlert("Added!","Successfully added "+user+"!","success");
            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });
        };

        $scope.reject_user = function(user){ // reject the pending user
            for(var i=0;i<$scope.pendingarray.length;i++){
                if($scope.pendingarray[i].rcs == user ){
                    $scope.pendingarray.splice(i,1);
                }
            }
            var offer_id = $location.search();
            rideService.removePendingRider(offer_id.id, user).then(function(data){ // removes the user that was pending and rehected
                sweetAlert("Removed!","Successfully removed "+user+"!","success");

            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });
        };

        $scope.remove_user = function(user){ // removes the user that was a rider
            $scope.seats_avil = $scope.seats_avil +1;
            for(var i=0;i<$scope.acceptedarray.length;i++) {
                if($scope.acceptedarray[i].rcs == user){
                    $scope.acceptedarray.splice(i,1);
                }
            }
            var offer_id = $location.search();
            rideService.removeRider(offer_id.id, user).then(function(data){
                sweetAlert("Removed!","Successfully removed "+user+"!","success"); //alert
            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });
        };

        $scope.join_offer2 = function(){ // these functions are all of the same but for the requsts instead of offers
            var request_id = $location.search();
            rideService.joinRequest(request_id.id,$cookies.get('user')).then(function(data) {
                sweetAlert("Joined!","Successfully request to join!","success");
                $scope.joined2=true;
            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });
        };

        $scope.owner_and_available_check2 = function(){
            var found = $filter('filter')($scope.drivers,{rcs:$scope.cookieusername},true);
            if(found != undefined) {
                if (found.length) {
                    return false;
                } else {
                    if ($scope.owner2 == true) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        };

        $scope.accept_driver = function(user){
            $scope.acceptedDriver.push({rcs:user,status:"accepted"});
            $scope.acceptedDriver_Bool = true;
            $scope.pendingDrivers = [];
            var request_id = $location.search();
            rideService.confirmDriver(request_id.id, user).then(function(data){
                sweetAlert("Added!","Accepted driver "+user+"!","success");
            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });
        };

        $scope.reject_driver = function(user){
            var request_id = $location.search();
            for(var i=0;i<$scope.pendingDrivers.length;i++){
                if($scope.pendingDrivers[i].rcs == user ){
                    $scope.pendingDrivers.splice(i,1);
                }
            }
            $scope.acceptedDriver = [];
            $scope.acceptedDriver_Bool = false;
            rideService.removeDriver(request_id.id,user).then(function(data){
                sweetAlert("Removed!","Successfully removed "+user+"!","success");
            }).catch(function(err){
                sweetAlert("Error!","There was an error! "+err.data,"error");
            });
        };


    }]);