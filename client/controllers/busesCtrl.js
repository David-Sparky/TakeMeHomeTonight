// Bus Controller
angular.module('tmht')
    .controller('busesCtrl', ['$scope', '$location', '$http', '$sce', function ($scope, $location, $http, $sce) {

        // Set default variables
        $scope.searchbar = "";
        $scope.searchbar_d = "";
        $scope.searchbar_id= "";
        $scope.loaded = true;
        $scope.loaded_stop= true;
        $scope.data_pres = false;

        //LOADED ENSURE THAT WE ARE DONE WITH THE API CALL TO MAKE SURE WE DON'T ANNOY THE API
        $scope.search = function () {
            if (!$scope.loaded) {
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
                //GET THE DATA FROM THE CDTA API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.bus = response.data;

                if ($scope.bus.status == 404) {
                    sweetAlert("Oops...", "We couldn't find that bus stop for you. Please try another search term.", "error");
                    $scope.data_pres = false;
                }
            });
        };

        $scope.directions = function () {
            if (!$scope.loaded) {
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
                //GET THE DATA FROM THE CDTA API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.dir = response.data;

                if ($scope.dir.status == 404) {
                    sweetAlert("Oops...", "We couldn't find that bus route for you. Please check the number and try again.", "error");
                    $scope.data_pres = false;
                }
                else {
                    $scope.data_pres = true;
                }


            });
        };

        $scope.checkRoute = function (dir) {
            var url = '/get_route';
            if (dir == '1') {
                var query = {info: '0', bus_num: $scope.searchbar_d};
            }
            else if (dir == '2') {
                var query = {info: '1', bus_num: $scope.searchbar_d};
            }

            $http.get(url, {params: query}).then(function (response) {
                //WE FINISHED THE QUERY, SO SET LOADED BACK TO TRUE
                $scope.loaded = true;
                //GET THE DATA FROM THE CDTA API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.br = response.data;
            });
        }

        $scope.escapeHTML = function (str) {
            return $sce.trustAsHtml(str);
        }

        $scope.refresh_outages = function () {
            $scope.loaded_out = false;
            //WE ARE RUNNING A QUERY, SO SET LOADED TO FALSE TO DISABLE THE BUTTON
            var url = "/service_status";

            $http.get(url, {}).then(function (response) {
                //WE FINISHED THE QUERY, SO SET LOADED BACK TO TRUE
                $scope.loaded_out = true;
                //GET THE DATA FROM THE CDTA API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.outage = response.data;
                console.log($scope.outage.alerts);
            });
        };


        $scope.stop_id = function () {
            if (!$scope.loaded_stop) {
                return;
            }

            $scope.loaded_stop = false;
            //WE ARE RUNNING A QUERY, SO SET LOADED TO FALSE TO DISABLE THE BUTTON
            var url = "/stop_id";

            //PUT TOGETHER THE QUERY FOR OUT SEARCH
            var query = {
                stopid: $scope.searchbar_id
            };

            $http.get(url, {params: query}).then(function (response) {
                //WE FINISHED THE QUERY, SO SET LOADED BACK TO TRUE
                $scope.loaded = true;
                //GET THE DATA FROM THE CDTA API AND TAKE THE RESPONSE AND SEND IT TO THE FRONT END OF THE PAGE
                $scope.arrs = response.data;

                if ($scope.arrs.status == 404) {
                    sweetAlert("Oops...", "We couldn't find that bus stop    for you. Please check the number and try again.", "error");
                    $scope.loaded_stop = true;
                }
                else {
                    $scope.loaded_stop = true;
                }
            });
        };
    }]);