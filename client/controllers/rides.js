angular.module('tmht')
.controller('rides', ['$scope','$location', function($scope, $location){

	if($location.path() == '/ridesOffered'){
		$scope.title = 'Rides Available';
		$scope.needed = false;
		$scope.ridesavail = true;
		$scope.offerarray = [{Time:'10:00pm',Pickup:'Quad',Seats:'2',TotalSeats:'3',Cost:'Free',Name:'Stephanie',Car:'2015 Honda Civic',CarColor:'Blue',Destination:"Price Chopper"},
												 {Time:'8:15am',Pickup:'Union',Seats:'3',TotalSeats:'4',Cost:'Some Gas Money',Name:'Matt',Car:'2009 Hyundai Accent',CarColor:'Gray',Destination:"Train Station"},
												 {Time:'2:30pm',Pickup:'Union',Seats:'4',TotalSeats:'4',Cost:'Doesn\'t Matter',Name:'Luis',Car:'2014 Ford Explorer',CarColor:'White',Destination:"North Adams, MA"},
												 {Time:'5:20pm',Pickup:'ECAV',Seats:'2',TotalSeats:'2',Cost:'Free',Name:'Gunnar',Car:'2015 Toyota Camry',CarColor:'Gray',Destination:"Walmart"},
												 {Time:'7:30am',Pickup:'North Lot',Seats:'1',TotalSeats:'1',Cost:'$10',Name:'Rick',Car:'Tesla Model S',CarColor:'Red',Destination:"York, PA"},
												 {Time:'6:45pm',Pickup:'Colonie Lot',Seats:'1',TotalSeats:'1',Cost:'$5',Name:'Lindsay',Car:'2015 Audi A4',CarColor:'Blue',Destination:"Albany Airport"},
												 {Time:'10:00am',Pickup:'15th Street Walk Over Bridge',Seats:'2',TotalSeats:'3',Cost:'Nothing',Name:'Zack',Car:'2012 BMW M2',CarColor:'Orange',Destination:"Price Chopper"},
												 {Time:'12:00pm',Pickup:'Somehwere',Seats:'2',TotalSeats:'2',Cost:'Free',Name:'Kelly',Car:'2010 Ford F150',CarColor:'Red',Destination:"Southern, MA"},
												 {Time:'6:45am',Pickup:'Somehwere',Seats:'1',TotalSeats:'2',Cost:'Anything',Name:'Audrie',Car:'2009 Chevy Malibu',CarColor:'White',Destination:"Rhode Island"},
												 {Time:'9:00pm',Pickup:'Somehwere',Seats:'0',TotalSeats:'4',Cost:'Food',Name:'Jacob',Car:'2015 Subaru WRX',CarColor:'Blue',Destination:"Anywhere"}
												]
	}
	else{
		$scope.title = "Rides Needed";
		$scope.needed = true;
		$scope.ridesavail = false;
		$scope.needarray =[{Person:'Jack',Time:'2:00pm',DateToGo:'3/20',PlaceToGo:'Price Chopper',Offer:'Food'},
											 {Person:'Laura',Time:'9:30am',DateToGo:'3/22',PlaceToGo:'Walmart',Offer:'$10'},
											 {Person:'Saul',Time:'7:30pm',DateToGo:'3/26',PlaceToGo:'Amtrak Station',Offer:'Gas Money'},
											 {Person:'Erik',Time:'11:00am',DateToGo:'3/25',PlaceToGo:'Testing Center - New Horizons',Offer:''},
											 {Person:'Linda',Time:'10:00am',DateToGo:'3/28',PlaceToGo:'Target',Offer:''}
											]
	}
}]);	