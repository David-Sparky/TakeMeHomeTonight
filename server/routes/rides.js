module.exports = function(io){

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
	collection.find().sort({departDate:1,departTime:1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/allOfferedRides', function(req,res){
	var collection = db.get().collection('offered');
	collection.find().sort({departDate:1,departTime:1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/get_ride', function(req,res){
	var id = req.query.id;
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
		collection.update({_id:ObjectID.createFromHexString(id)}, {$push: {riders:{rcs:user,status:"pending"}}}, function(err, results){
			if(err) throw err;
			collection.find({_id: ObjectID.createFromHexString(id)}).toArray(function(err, docs){
				db.get().collection('users').update({rcs: docs[0].owner}, {$push: {notifications: {rideID:id, db:'offered', time: new Date(), message: req.session.cas_user + ' requested your offered ride', seen: false}}}, function(err, results){
					if(err) throw err;
					io().of(docs[0].owner).emit('notification', 'random shit');
				})
				res.status(200).send('Added to the list of pending users!');
			})
			
		});
	}
});


router.put('/confirmRider', function(req, res){
	var collection = db.get().collection('offered');
	var id = ObjectID.createFromHexString(req.body.rideID);
	collection.find({_id: id}).toArray(function(err,docs){
		if(err) throw err;
		if(docs.length <= 0){
			res.status(400).send('no corresponding ride');
		}
		else if(docs[0].owner != req.session.cas_user){
			console.log("This user doesn't have access to confirm ride");
		}
		else if(docs[0].availableseats == 0){
			res.status(400).send('There are no more seats available!');
		}
		else{
			collection.update({_id: id, 'riders.rcs': req.body.rcs}, {$set: {'riders.$.status': 'accepted'}, $inc: {availableseats: -1}}, function(err, docs){
				if(err) throw err;
				db.get().collection('users').update({rcs: req.body.rcs}, {$push: {notifications: {rideID: id, db:'offered', time: new Date(), message: 'You have been confirmed for ' + req.session.cas_user + '\'s ride', seen: false}}}, function(err, results){
					if(err) throw err;
					io().to(req.body.rcs).emit('notification');
				});
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
		if(docs.length <= 0){
			res.status(400).send('no corresponding ride');
		}
		else if(docs[0].rcs != req.session.cas_user){
			console.log("This user doesn't have access to confirm driver");
		}
		else{
			collection.update({_id: id, 'drivers.rcs': req.body.rcs}, {$set: {'drivers.$.status': 'accepted', accepted: true}}, function(err, docs){
				if(err) throw err;
				db.get().collection('users').update({rcs: req.body.rcs}, {$push: {notifications: {rideID:id, db:'requested', time: new Date(), message: req.session.cas_user + ' confirmed you as their driver', seen: false}}}, function(err,results){
					if(err) throw err;
					io().to(req.body.rcs).emit('notification');
				});
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
		collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
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
			collection.find({_id: ObjectID.createFromHexString(id)}).toArray(function(err, docs){
				db.get().collection('users').update({rcs: docs[0].rcs}, {$push: {notifications: {rideID:id, db:'requested', time: new Date(), message: req.session.cas_user + ' has requested to give you a ride', seen: false}}}, function(err,results){
					if(err) throw err;
					io().to(docs[0].rcs).emit('notification');
				});
			});
			res.status(200).send('Added to the list of pending users!');
		});
	}
});


router.delete('/removeRider', function(req, res){
	var collection = db.get().collection('offered');
	collection.find({_id: ObjectID.createFromHexString(req.query.rideID), riders:{rcs: req.query.rcs, status: 'accepted'}}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length == 0){
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {riders: {rcs: req.query.rcs}}}, function(err, results){
				if(err) throw err;

				res.send('Rider Removed!');
			});
		}
		else{
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {riders: {rcs: req.query.rcs}}, $inc: {availableseats: 1}}, function(err, results){
				if(err) throw err;
				res.send('Rider Removed!');
			});
		}
		db.get().collection('users').update({rcs: req.query.rcs}, {$push: {notifications: {rideID: ObjectID.createFromHexString(req.query.rideID), db:'offered', time: new Date(), message: req.session.cas_user + " has removed you as their passenger", seen: false}}}, function(err,results){
			if(err) throw err;
			io().to(req.query.rcs).emit('notification');
		});

	});

});

router.delete('/removePendingRider', function(req, res){
	var collection = db.get().collection('offered');
	collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {riders: {rcs: req.query.rcs}}}, function(err, results){
		if(err) throw err;
		db.get().collection('users').update({rcs: req.query.rcs}, {$push: {notifications: {rideID:ObjectID.createFromHexString(req.query.rideID), db:'offered', time: new Date(), message: req.session.cas_user + ' has removed you as their passenger', seen: false}}}, function(err,results){
			if(err) throw err;
			io().to(req.query.rcs).emit('notification');
		});
		res.send('Pending Rider Removed!');
	});
});

router.delete('/removeDriver', function(req, res){
	var collection = db.get().collection('requested');
	collection.find({_id:ObjectID.createFromHexString(req.query.rideID), drivers: {rcs: req.query.rcs, status: 'accepted'}}).toArray(function(err,docs){
		if(err) throw err;
		if(docs.length == 0){
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {drivers:{rcs: req.query.rcs}}}, function(err, result){
				if(err) throw err;
				res.send('Driver removed!');
			});
		}
		else{
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {drivers: {rcs: req.query.rcs}}, $set:{accepted: false}}, function(err, results){
				if(err) throw err;
				res.send('Driver removed!');
			});
		}
		db.get().collection('users').update({rcs: req.query.rcs}, {$push: {notifications: {rideID:ObjectID.createFromHexString(req.query.rideID), db:'requested', time: new Date(), message: req.session.cas_user + ' removed you as their driver', seen: false}}}, function(err,results){
			if(err) throw err;
			io().to(req.query.rcs).emit('notification');
		});
	});
});

router.delete('/removeRideOffer', function(req, res){
	var collection = db.get().collection('offered');
	collection.remove({_id: ObjectID.createFromHexString(req.query.rideID), owner: req.session.cas_user}, function(err, results){
		if(err) throw err;
		res.send('Ride Offer was removed!');
	});
});

router.delete('/removeNeededRide', function(req, res){
	var collection = db.get().collection('requested');
	collection.remove({_id: ObjectID.createFromHexString(req.query.rideID), rcs: req.session.cas_user}, function(err, results){
		if(err) throw(err);
		res.send('Needed Ride was removed!');
	});
});

router.delete('/removeNeededRideOfferDriver', function(req, res){
	var collection = db.get().collection('requested');
	collection.find({_id: ObjectID.createFromHexString(req.query.rideID), drivers: {rcs: req.session.cas_user, status: 'accepted'}}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length == 0){
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {drivers: {rcs: req.session.cas_user}}}, function(err, results){
				if(err) throw err;
				collection.find({_id: ObjectID.createFromHexString(req.query.rideID)}).toArray(function(err, docs2){
					db.get().collection('users').update({rcs: docs2[0].rcs}, {$push: {notifications: {rideID:ObjectID.createFromHexString(req.query.rideID), db:'requested', time: new Date(), message: req.session.cas_user + ' removed themselves as a potential driver', seen: false}}}, function(err,results){
						if(err) throw err;
						io().to(docs2[0].rcs).emit('notification');
					});
				});
				res.send('Deleted!');
			});
		}
		else{
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {drivers: {rcs: req.session.cas_user}}, $set: {accepted: false}},function(err, results){
				if(err) throw err;

				collection.find({_id: ObjectID.createFromHexString(req.query.rideID)}).toArray(function(err, docs2){
					db.get().collection('users').update({rcs: docs2[0].rcs}, {$push: {notifications: {rideID:ObjectID.createFromHexString(req.query.rideID), db:'requested', time: new Date(), message: req.session.cas_user + ' removed themselves as your driver', seen: false}}}, function(err,results){
						if(err) throw err;
						io().to(docs2[0].rcs).emit('notification');
					});
				});
				res.send('Deleted!');
			});
		}
		
		
	});
	
});

router.delete('/removeRequestForAvailableRide', function(req, res){
	var collection = db.get().collection('offered');
	collection.find({_id: ObjectID.createFromHexString(req.query.rideID), riders: {rcs: req.session.cas_user, status: 'accepted'}}).toArray(function(err, docs){
		if(err) throw err;
		if(docs.length == 0){
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {riders: {rcs: req.session.cas_user}}}, function(err, docs){
				if(err) throw err;
				collection.find({_id: ObjectID.createFromHexString(req.query.rideID)}).toArray(function(err, docs2){
					db.get().collection('users').update({rcs: docs2[0].owner}, {$push: {notifications: {rideID:ObjectID.createFromHexString(req.query.rideID), db:'offered', time: new Date(), message: req.session.cas_user + ' removed themselves as a potential rider', seen: false}}}, function(err,results){
						if(err) throw err;
						io().to(docs2[0].owner).emit('notification');
					});
				});

				res.send('Deleted');
			});
		}
		else{
			collection.update({_id: ObjectID.createFromHexString(req.query.rideID)}, {$pull: {riders: {rcs: req.session.cas_user}}, $inc: {availableseats: 1}}, function(err, docs){
				if(err) throw err;

				collection.find({_id: ObjectID.createFromHexString(req.query.rideID)}).toArray(function(err, docs2){
					db.get().collection('users').update({rcs: docs2[0].owner}, {$push: {notifications: {rideID:ObjectID.createFromHexString(req.query.rideID), db:'offered', time: new Date(), message: req.session.cas_user + ' removed themselves as a passenger. You have an extra seat available', seen: false}}}, function(err,results){
						if(err) throw err;
						io().to(docs2[0].owner).emit('notification');
					});
				});
				res.send('Deleted');
			});
		}
	});
});


return router;

}