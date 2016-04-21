var express = require('express'),
	router = express.Router(),
	db = require('../db');


router.post('/signUp', function(req, res){
	console.log(req.body);
	var collection = db.get().collection('users');
	collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length != 0){
			//user already exists
		}
		else{
			collection.insert({rcs: req.session.cas_user, firstName: req.body.firstName, lastName: req.body.lastName}, function(err, results){
				if(err) throw err;
				console.log(results);
				if(results.result.insertedCount == 1){
					res.status(200).send('/#/landing');
				}
			});
		}
	});
});


module.exports = router;