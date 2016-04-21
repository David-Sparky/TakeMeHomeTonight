var express = require('express'),
	router = express.Router(),
	db = require('../db');


router.post('/requestRide', function(req, res){
	console.log(req.body);
});

router.post('/addRide', function(req,res){
	console.log(req.body);
});








module.exports = router;