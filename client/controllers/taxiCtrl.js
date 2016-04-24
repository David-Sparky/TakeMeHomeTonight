angular.module('tmht')
.controller('taxiCtrl', ['$scope','$location', function($scope, $location){
  $scope.taxiarray = 
  [ {Company:'ACES Taxi',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs'},
  	{Company:'Acme Taxi',Phone:'518-233-8294',Website:'http://www.yelp.com/biz/acme-taxi-cohoes'}, 
  	{Company:'Black & White Cab System',Phone:'518-272-6961',Website:'http://taxiservice-troy.ny-biz.co'},
  	{Company:'Capitaland Taxi',Phone:'518-273-6666',Website:'http://www.capitalandtaxi.com'}
  ]

}]);