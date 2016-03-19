angular.module('tmht')
.controller('offerRides', ['$scope', '$http', '$window', function($scope, $http, $window){
	//All of these are just static arrays for the demo, once we get real data this will update with that. Until then this is what will be displaying
	$scope.times = ['10:00pm','8:15am','2:30pm','5:20pm','7:30am','6:45pm','10:00am','12:00pm','6:45am','9:00pm'];
	$scope.locations = ["Quad","Union","Union","ECAV","North Lot","Colonie Lot","15th Street Walk Over Bridge","Somehwere","Not here","Or There"];
	$scope.seats = [2,3,4,2,1,1,0,2,1,0];
	$scope.totalseats = [3,4,4,2,2,1,2,2,2,4];
	$scope.cost = ['Free','Some Gas Money','Doesn\'t Matter','Free','$10','$5','Nothing','Free','Anything','Food'];	
	$scope.names = ['Stephanie','Matt','Luis','Gunnar','Rick','Lindsay','Zack','Kelly','Audrie','Jacob'];
	$scope.cars = ['2015 Honda Civic','2009 Hyundai Accent','2014 Ford Explorer','2015 Toyota Camry','Tesla Model S','2015 Audi A4','2012 BMW M2','2010 Ford F150','2009 Chevy Malibu','2015 Subaru WRX'];
	$scope.colors = ['Blue','Gray','White','Gray','Red','Blue','Orange','Red','White','Blue'];

}]);