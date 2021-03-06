// Public Transit Controller
angular.module('tmht')
    .controller('publicTransitCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){

        // Set default variables
        $scope.searchbar = "";
        $scope.searchbar_d= "";
        $scope.loaded = true;

        //LOADED ENSURE THAT WE ARE DONE WITH THE API CALL TO MAKE SURE WE DON'T ANNOY THE API
        $scope.search = function () {
            if(!$scope.loaded) {
                return;
            }

            $scope.loaded = false;
            //WE ARE RUNNING A QUERY, SO SET LOADED TO FALSE TO DISABLE THE BUTTON
            var url = "/cdta";

            //PUT TOGETHER THE QUERY FOR OUT SEARCH
            var query = {
                search_b: $scope.searchbar
            };

            $http.get(url, {params: query}).then(function (response) {
                //WE FINISHED THE QUERY, SO SET LOADED BACK TO TRUE
                $scope.loaded = true;
                //GET THE DATA FROM THE TWITTER API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.bus = response.data;                
            });
        };

        $scope.directions= function () {
            if(!$scope.loaded) {
                return;
            }

            $scope.loaded = false;
            //WE ARE RUNNING A QUERY, SO SET LOADED TO FALSE TO DISABLE THE BUTTON
            var url = "/cdta_dir";

            //PUT TOGETHER THE QUERY FOR OUT SEARCH
            var query = {
                search_b: $scope.searchbar_d
            };

            $http.get(url, {params: query}).then(function (response) {
                //WE FINISHED THE QUERY, SO SET LOADED BACK TO TRUE
                $scope.loaded = true;
                //GET THE DATA FROM THE TWITTER API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.bus = response.data;
            });
        };

        $scope.checkRoute= function (dir) {
            var url= '/get_route';
            if(dir== '1'){
                var query = { info: '0', bus_num: $scope.searchbar_d};
            } else if(dir== '2'){
                var query = { info: '1', bus_num: $scope.searchbar_d};
            }

            $http.get(url, {params: query}).then(function (response) {
                //WE FINISHED THE QUERY, SO SET LOADED BACK TO TRUE
                $scope.loaded = true;
                //GET THE DATA FROM THE TWITTER API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.br = response.data;
            });
        }
    }]);