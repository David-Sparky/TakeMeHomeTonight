module.exports = function(io){ // all of these are what is called by the service.js

var express = require('express'),
	router = express.Router(),
	db = require('../db'); // use the db.js file that has the connect and close for the mongodb.

router.use('*', function(req, res, next){ // authentication things, to ensure a use=r is actually logged in.
  if(!req.session || !req.session.cas_user){
    res.status(401).send('Unauthorized access');
  }
  else{
    next();
  }
});

router.post('/requestRide', function(req, res){ // request a ride, this is based on the form input and we add extra fields by adding to the req.body.
	if(!req.session || !req.session.cas_user){
		// no user logged in
	}
	else{
		req.body['drivers']=[];
		req.body.rcs = req.session.cas_user;
		req.body.accepted = false;
		var collection = db.get().collection('requested');
		collection.insert(req.body, function(err, results){
			if(err) throw err;
			if(results.insertedCount == 1){
				res.send({Success: 'Ride was requested'}); // send a success to the front end to alert
			}
			else{
				// error inserting into db
			}
		})
	}
});

router.post('/addRide', function(req,res){ // add an offer to the database - does the same thing that the request ride addition does just in a different collection with slightly different variables
	if(!req.session || !req.session.cas_user){
		// no user logged in
	} else{
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

router.get('/allRequestedRides', function(req, res){ // get all requests riders - checks to ensure that the ride is not less than today and then default sorts them by date and then time
	var date = new Date();
	date = date.toISOString();
	var collection = db.get().collection('requested');
	collection.find({departDate:{$gte:date}}).sort({departDate:1,departTime:1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/allOfferedRides', function(req,res){ // gets all offered rides - ensures tht there are seats vailable and that the depart date is greater than today  - does the default date/time sortS
	var date = new Date();
	date = date.toISOString();
	var collection = db.get().collection('offered');
	collection.find({availableseats:{$ne:0},departDate:{$gte:date}}).sort({departDate:1,departTime:1}).toArray(function(err, docs){
		if(err) throw err;
		res.send(docs);
	});
});

router.get('/get_ride', function(req,res){ // returns a specific ride based on the id passed in - this gets all information about a requested ride.
	var id = req.query.id;
	if(!req.session && !req.session.cas_user){
		//user does not exist
		console.log("User does not exist");
	}
	else {
		var collection = db.get().collection('requested');
		collection.find({_id:ObjectID.createFromHexString(id)}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
		});
	}
});


router.get('/get_offer', function(req,res){ // return specific ride information for an offer - similar to the get_ride just on the offered collection
	var id = req.query.id;
	if(!req.session && !req.session.cas_user){
		//user does not exist
		console.log("User does not exist");
	}
	else {
		var collection = db.get().collection('offered');
		collection.find({_id:ObjectID.createFromHexString(id)}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
		});

	}
});


router.get('/offeredRidesPerUser', function(req, res){ // returns all offered rides by the current user.
	if(!req.session && !req.session.cas_user){
		console.log("user does not exist");
	}
	else {
		var collection = db.get().collection('offered');
		collection.find({owner: req.session.cas_user}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
		});
	}
});



router.put('/join_offer', function(req, res) { // joins an offer based on the id
	var id = req.body.id;
	var user = req.body.user;
	var collection = db.get().collection('offered');
	if(!req.session && !req.session.cas_user){
		console.log("User does not exist"); // ensures the user is logged in
	}
	else {
		collection.update({_id:ObjectID.createFromHexString(id)}, {$push: {riders:{rcs:user,status:"pending"}}}, function(err, results){ // add the user to the array as pending
			if(err) throw err;
			collection.find({_id: ObjectID.createFromHexString(id)}).toArray(function(err, docs){ // this does the notification for the users.
				db.get().collection('users').update({rcs: docs[0].owner}, {$push: {notifications: {rideID:id, db:'offered', time: new Date(), message: req.session.cas_user + ' requested your offered ride', seen: false}}}, function(err, results){
					if(err) throw err;
					io().to(docs[0].owner).emit('notification'); // emit to the owner that there was a notification
				})
				res.status(200).send('Added to the list of pending users!');
			})
			
		});
	}
});


router.put('/confirmRider', function(req, res){ // confirm the pending user and then alert them - this is similar to the above put but does extra error checking
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

router.put('/confirmDriver', function(req, res){ // same as confirm rider but for a request not an offer
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
router.get('/requestedRidesPerUser', function(req, res){ // this does a aggregate to get all of the offered rides where the current user is a rider
	if(!req.session && !req.session.cas_user){
		// user does not exist
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

router.get('/offersForNeededRidesDriver', function(req,res){ // gets all rides where the current users is asking or is the driver
	if(!req.session && !req.session.cas_user){
		// user does not exist
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

router.get('/offersForNeededRidesRider', function(req, res){ // gets all in the requested collection for the current user.
	if(!req.session && !req.session.cas_user){
		// user does not exist
	}
	else{
		var collection = db.get().collection('requested');
		collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
			if(err) throw err;
			res.send(docs);
		});
	}
});

router.put('/join_request', function(req, res) { // joins the request for the ride as a driver - then emails to the current owner and updates the database.
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


router.delete('/removeRider', function(req, res){ // removes a current rider from the ride - if the rider is accepted the available seats is adjusted to increase 1 otherwise the user is just removed
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
		} // the line below pushes to the notifications and alerts the user by using the emit
		db.get().collection('users').update({rcs: req.query.rcs}, {$push: {notifications: {rideID: ObjectID.createFromHexString(req.query.rideID), db:'offered', time: new Date(), message: req.session.cas_user + " has removed you as their passenger", seen: false}}}, function(err,results){
			if(err) throw err;
			io().to(req.query.rcs).emit('notification');
		});

	});

});

router.delete('/removePendingRider', function(req, res){ // same as above but it only for users that are pending - this is used in the rides requested page and not the userSeetings
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

router.delete('/removeDriver', function(req, res){ // removes the driver and alerts them that they were removed. again if the driver is accpeted then remove them, set the ride back to not accepted and
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

router.delete('/removeRideOffer', function(req, res){ // just deletes the ride offer
	var collection = db.get().collection('offered');
	collection.remove({_id: ObjectID.createFromHexString(req.query.rideID), owner: req.session.cas_user}, function(err, results){
		if(err) throw err;
		res.send('Ride Offer was removed!');
	});
});

router.delete('/removeNeededRide', function(req, res){ // removes the requested ride
	var collection = db.get().collection('requested');
	collection.remove({_id: ObjectID.createFromHexString(req.query.rideID), rcs: req.session.cas_user}, function(err, results){
		if(err) throw(err);
		res.send('Needed Ride was removed!');
	});
});

router.delete('/removeNeededRideOfferDriver', function(req, res){ // removes the ride where the current user is the driver -this again can be accepted or pending and will adjust the database appropriately then emits a notification.
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

router.delete('/removeRequestForAvailableRide', function(req, res){ // does the same as above but where the user is a current or pending rider of an offered ride
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