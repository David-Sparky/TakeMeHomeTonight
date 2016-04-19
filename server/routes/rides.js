var express = require('express'),
	router = express.Router(),
	app = express();


router.post('/requestRide', function(req, res){
	console.log(req.body);
});

router.post('/addRide', function(req,res){
	console.log(req.body);
});








module.exports = router;