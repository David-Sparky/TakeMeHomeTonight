angular.module('tmht')
.controller('planeCtrl', ['$scope','$location', function($scope, $location){
  $scope.planearray = 
  [ {logo: 'american.png', Airline:'American Airlines',Phone:'1-800-882-8880',Website:'https://www.aa.com', Albany: 'Yes'},
  	{logo: 'delta.png', Airline:'Delta Air Lines',Phone:'1-800-455-2720',Website:'http://www.delta.com', Albany: 'Yes'},
  	{logo: 'southwest.png', Airline:'Southwest Airlines',Phone:'1-800-435-9792',Website:'https://www.southwest.com', Albany: 'Yes'},
  	{logo: 'united.png', Airline:'United Airlines',Phone:'1-800-864-8331',Website:'https://www.united.com', Albany: 'Yes'},
  	{logo: 'jetblue.png', Airline:'JetBlue Airways',Phone:'1-800-538-2583',Website:'http://www.jetblue.com', Albany: 'Yes'},
  	{logo: 'alaska.png', Airline:'Alaska Airlines',Phone:'1-800-252-7522',Website:'https://www.alaskaair.com', Albany: 'No'},
  	{logo: 'spirit.png', Airline:'Spirit Airlines',Phone:'1-801-401-2222',Website:'https://www.spirit.com', Albany: 'No'},
  	{logo: 'frontier.png', Airline:'Frontier Airlines',Phone:'1-801-401-9000',Website:'https://www.flyfrontier.com', Albany: 'No'},
  	{logo: 'hawaiian.png', Airline:'Hawaiian Airlines',Phone:'1-877-426-4537',Website:'https://www.hawaiianairlines.com', Albany: 'No'},
  	{logo: 'allegiant.png', Airline:'Allegiant Air',Phone:'1-702-505-8888',Website:'https://www.allegiantair.com', Albany: 'No'},
  	{logo: 'virgin.png', Airline:'Virgin America',Phone:'1-877-359-8474',Website:'https://www.virginamerica.com', Albany: 'No'}
  ]

}]);