var express = require('express'),
	router = express.Router(),
	db = require('../db');

router.use('*', function(req, res, next){
  console.log(req);
  if(!req.session || !req.session.cas_user){
    res.status(401).send('Unauthorized access');
  }
  else{
    next();
  }
});

router.post('/requestRide', function(req, res){
	if(!req.session || !req.session.cas_user){
		//no user logged in
		console.log('no user');
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
	if(!req.session || !req.session.cas_user){
		//no user logged in
		console.log('no user');
	}else{
		req.body['availableseats'] = req.body['seats'];
		req.body['riders']=[];
		req.body['owner'] = req.session.cas_user;
		var collection = db.get().collection('offered');
		collection.insert(req.body, function(err, results){
			if(err) throw err;
			console.log(results);
			if(results.insertedCount == 1){
				res.send({Success: 'Ride is now offered'});
			}
			else{
				//error inserting into db\
				console.log('error inserting ride offer');
			}
		})
	}
});


router.get('/allRequestedRides', function(req, res){
	var collection = db.get().collection('requested');
	collection.find().toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/allOfferedRides', function(req,res){
	var collection = db.get().collection('offered');
	collection.find().toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/get_ride', function(req,res){
	var id = req.query.id;
	//console.log(id);
	if(!req.session && !req.session.cas_user){
		//user does not exist
		console.log("User does not exist");
	}
	else{
		var collection = db.get().collection('requested');
		collection.find({_id:ObjectID.createFromHexString(id)}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
		});
	}
});


router.get('/get_offer', function(req,res){
	var id = req.query.id;
	//console.log(id);
	if(!req.session && !req.session.cas_user){
		//user does not exist
		console.log("User does not exist");
	}
	else{
		var collection = db.get().collection('offered');
		collection.find({_id:ObjectID.createFromHexString(id)}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
		});

	}
});

router.put('/join_offer', function(req, res) {
	var id = req.body.id;
	var user = req.body.user;
	var collection = db.get().collection('offered');
	if(!req.session && !req.session.cas_user){
		console.log("User does not exist");
	}
	else{
		collection.update({_id:ObjectID.createFromHexString(id)}, {$push: {riders:{rcs:user,status:"pending"}},$inc:{availableseats:-1}}, function(err, results){
			if(err) throw err;
			res.status(200).send('Added to the list of pending users!');
		});
	}
});

router.put('/accept_join_offer', function(req, res) {
	var id = req.body.id;
	var user = req.body.user;
	var collection = db.get().collection('offered');
	if(!req.session && !req.session.cas_user){
		console.log("User does not exist");
	}
	else{
		collection.update({_id:ObjectID.createFromHexString(id)}, {$set: {'riders.'+index+'.status':"accepted"}}}, function(err, results){
			if(err) throw err;
			res.status(200).send('Updated '+user+" status to accepted");
		});
	}
});



module.exports = router;