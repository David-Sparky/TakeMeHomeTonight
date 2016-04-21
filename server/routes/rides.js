var express = require('express'),
	router = express.Router(),
	db = require('../db');


router.post('/requestRide', function(req, res){
	console.log(req.body);
	if(!req.session && !req.session.cas_user){

	}
	else{
		req.body.rcs = req.session.cas_user;
		var collection = db.get().collection('requested');
		collection.insert(req.body, function(err, results){
			if(err) throw err;
			console.log(results);
			if(results.insertedCount == 1){
				res.send({Success: 'Ride was requested'});
			}
			else{
				//error inserting into db\
				console.log('error inserting ride request');
			}
		})
	}
});

router.post('/addRide', function(req,res){
	console.log(req.body);
});

module.exports = router;