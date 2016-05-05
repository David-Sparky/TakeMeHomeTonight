var express = require('express'),
	router = express.Router(),
	db = require('../db');




router.get('/checkSessionStatus', function(req, res){
	if(req.session == undefined || req.cookies == undefined){
		res.send(false);
	}
	else if(req.session.cas_user == req.cookies.user){
		res.send(true);
	}
	else{
		res.send(false);
	}
});

router.use('*', function(req, res, next){
  if(req.path == '/user/logout' || req.path == '/user/signUp')
    next();
  else if(!req.session || !req.session.cas_user){
    res.status(401).send('Unauthorized access');
  }
  else{
    next();
  }
});

router.post('/signUp', function(req, res){
		var collection = db.get().collection('users');
		collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
			if(err) throw err;
			if(docs.length != 0){
				//user already exists
			}
			else{
				collection.insert({rcs: req.session.cas_user, firstName: req.body.firstName, lastName: req.body.lastName, notifications: []}, function(err, results){
					if(err) throw err;
					if(results.insertedCount == 1){
						res.cookie('user', req.session.cas_user);
						res.status(200).send('/#/landing');
					}
				});
			}
		});
});

router.get('/getUserSettingsInfo', function(req, res){
	var collection = db.get().collection('users');
	if(!req.session && !req.session.cas_user){
		//user does not exist
	}
	else{
		collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
			if(err) throw err;
			if(docs.length == 0){
				//user not found
				console.log('user not found');
			}
			else{
				res.send(docs[0]);
			}
		})
	}
});

router.put('/editUserSettings', function(req, res){
	var collection = db.get().collection('users');
	if(!req.session && !req.session.cas_user){
		//user does not exist
	}
	else{
		collection.update({rcs: req.session.cas_user}, {$set: {firstName: req.body.firstName, lastName: req.body.lastName, car: req.body.car}}, function(err, results){
			if(err) throw err;
			res.status(200).send('User changes saved');
		});
	}

});

module.exports = router;