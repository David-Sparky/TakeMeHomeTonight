angular.module('tmht')
.controller('planeCtrl', ['$scope','$location', function($scope, $location){
  $scope.taxiarray = 
  [ {logo: 'american.png', Airline:'American Airlines',Phone:'1-800-882-8880',Website:'https://www.aa.com/', Albany: 'Yes'},
  	{logo: 'delta.png', Airline:'Delta Air Lines',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'Yes'},
  	{logo: 'southwest.png', Airline:'Southwest Airlines',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'Yes'},
  	{logo: 'united.png', Airline:'United Airlines',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'Yes'},
  	{logo: 'jetblue.png', Airline:'JetBlue Airways',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'Yes'},
  	{logo: 'alaska.png', Airline:'Alaska Airlines',Phone:'1-800-654-5669',Website:'https://www.alaskaair.com', Albany: 'No'},
  	{logo: 'spirit.png', Airline:'Spirit Airlines',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'No'},
  	{logo: 'frontier.png', Airline:'Frontier Airlines',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'No'},
  	{logo: 'hawaiian.png', Airline:'Hawaiian Airlines',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'No'},
  	{logo: 'allegiant.png', Airline:'Allegiant Air',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'No'},
  	{logo: 'virgin.png', Airline:'Virgin America',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'No'},
  	{logo: 'suncountry.png', Airline:'Sun Country',Phone:'518-878-8812',Website:'http://www.yelp.com/biz/aces-taxi-saratoga-springs', Albany: 'No'}
  ]

}]);