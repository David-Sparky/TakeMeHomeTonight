angular.module('tmht')
.controller('taxiCtrl', ['$scope','$location', function($scope, $location){
  $scope.taxiarray = 
  [ {Company:'ACES Taxi',Phone:'518-878-8812',Address:'400 Broadway Saratoga Springs, NY 12866',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs'},
  	{Company:'Acme Taxi',Phone:'518-233-8294',Address:'302 Ontario St, Cohoes, NY 12047',Website:'http://www.yelp.com/biz/acme-taxi-cohoes'}, 
  	{Company:'Black & White Cab System',Phone:'518-272-6961',Address:'415 Fulton Street Troy, NY 12180',Website:'http://taxiservice-troy.ny-biz.co'},
  	{Company:'Capitaland Taxi',Phone:'518-273-6666',Address:'159 4th Street Troy, NY 12180',Website:'http://www.capitalandtaxi.com'}
  ]

}]);