var express = require('express'),
	router = express.Router(),
	db = require('../db');

router.use('*', function(req, res, next){
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
		req.body['drivers']=[];
		req.body.rcs = req.session.cas_user;
		req.body.accepted = false;
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
		req.body.availableseats = req.body.seats;
		req.body.owner = req.session.cas_user;
		req.body.riders = [];
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


router.get('/offeredRidesPerUser', function(req, res){
	if(!req.session && !req.session.cas_user){
		console.log("user does not exist");
	}
	else{
		var collection = db.get().collection('offered');
		collection.find({owner: req.session.cas_user}).toArray(function(err, docs){
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


router.put('/confirmRide', function(req, res){
	var collection = db.get().collection('offered');
	var id = ObjectID.createFromHexString(req.body.rideID);
	collection.find({_id: id}).toArray(function(err,docs){
		if(err) throw err;
		console.log(docs);
		if(docs.length <= 0){
			res.status(400).send('no corresponding ride');
		}
		else if(docs[0].owner != req.session.cas_user){
			console.log("This user doesn't have access to confirm ride");
		}
		else{
			collection.update({_id: id, 'riders.rcs': req.body.rcs}, {$set: {'riders.$.status': 'accepted'}, $inc: {availableseats: -1}}, function(err, docs){
				if(err) throw err;
				console.log(docs);
				res.status(200).send("updated");
			});
		}
	});
});

router.put('/confirmDriver', function(req, res){
	var collection = db.get().collection('requested');
	var id = ObjectID.createFromHexString(req.body.rideID);
	collection.find({_id: id}).toArray(function(err,docs){
		if(err) throw err;
		console.log(docs);
		if(docs.length <= 0){
			res.status(400).send('no corresponding ride');
		}
		else if(docs[0].rcs != req.session.cas_user){
			console.log("This user doesn't have access to confirm driver");
		}
		else{
			collection.update({_id: id, 'drivers.rcs': req.body.rcs}, {$set: {'drivers.$.status': 'accepted', accepted: true}}, function(err, docs){
				if(err) throw err;
				console.log(docs);
				res.status(200).send("updated");
			});
		}
	});
});

//Rides a user has requested
router.get('/requestedRidesPerUser', function(req, res){
	if(!req.session && !req.session.cas_user){
		console.log("user does not exist");
	}
	else{
		var collection = db.get().collection('offered');
		//collection.find({'riders.rcs': req.session.cas_user}, {riders: 0}
		collection.aggregate([
			{$unwind : '$riders'},
			{$match: {'riders.rcs': req.session.cas_user}},
			{$group: {
				_id: '$_id', 
				riders: {$push: '$riders'},
				departLocation: {$first:'$departLocation'},
				car: {$first:'$car'},
				departTime: {$first:'$departTime'},
				departDate: {$first:'$departDate'},
				destination: {$first:'$destination'},
				cost: {$first:'$cost'},
				seats: {$first:'$seats'},
				availableseats: {$first:'$availableseats'}
			}}
			/*
			{$match : {'riders.rcs': req.session.cas_user}},
			{$project: {
				riders: {
					$filter: {
						input: '$riders',
						as: 'item',
						cond: {'$$item.rcs': req.session.cas_user}//{$eq: ['$$item.rcs' req.session.cas_user]}
					}
				}
			}}*/
		]).toArray(function(err, docs){
			if(err) throw err;

			res.send(docs);
		});
	};
});

router.get('/offersForNeededRidesDriver', function(req,res){
	if(!req.session && !req.session.cas_user){
		console.log("user does not exist");
	}
	else{
		var collection = db.get().collection('requested');
		collection.aggregate([
			{$unwind : '$drivers'},
			{$match: {'drivers.rcs': req.session.cas_user}},
			{$group: {
				_id: '$_id', 
				drivers: {$push: '$drivers'},
				departLocation: {$first:'$departLocation'},
				departTime: {$first:'$departTime'},
				departDate: {$first:'$departDate'},
				destination: {$first:'$destination'},
				cost: {$first:'$cost'},
			}}
		]).toArray(function(err, docs){
			if(err) throw err;

			res.send(docs);
		});
	}
});

router.get('/offersForNeededRidesRider', function(req, res){
	if(!req.session && !req.session.cas_user){
		console.log("user does not exist");
	}
	else{
		var collection = db.get().collection('requested');
		collection.find({rcs: req.session.cas_user, accepted: 'true'}).toArray(function(err, docs){
			if(err) throw err;
			collection.find({rcs: req.session.cas_user, $or : [{accepted: 'false'}, {accepted: {$exists: false}}]}).toArray(function(err, docs2){
				if(err) throw err;

				res.send({accepted:docs, pending: docs2});
			});
			//res.send(docs);
		});
	}
});

router.put('/join_request', function(req, res) {
	var id = req.body.id;
	var user = req.body.user;
	var collection = db.get().collection('requested');
	if(!req.session && !req.session.cas_user){
		console.log("User does not exist");
	}
	else{
		collection.update({_id:ObjectID.createFromHexString(id)}, {$push: {drivers:{rcs:user,status:"pending"}}}, function(err, results){
			if(err) throw err;
			res.status(200).send('Added to the list of pending users!');
		});
	}
});




module.exports = router;