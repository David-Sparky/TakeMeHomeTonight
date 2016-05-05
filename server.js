//testing a js file for heroku
var db = require('./server/db');
    ObjectID = require('mongodb').ObjectID,
  	bodyParser = require('body-parser'),
  	cookieParser = require('cookie-parser'),
  	path = require('path'),
  	CASAuthentication = require('cas-authentication'),
  	session = require('express-session'),
    express = require('express'),
    app = express();
    fs = require('fs'),
    http = require('http'),
    server = http.Server(app)
    io = require('socket.io')(server),
    MongoDbStore = require('connect-mongodb-session')(session),
    dbURI = 'mongodb://' + process.env.tmhtDBUser + ':' + process.env.tmhtDBPassword + '@ds023418.mlab.com:23418/tmht',
    sessionStore = new MongoDbStore({
      uri: dbURI,
      collection: 'mySessions'
    }),
    cookie = require('cookie');

var getIOInstance = function(){
  return io;
}

// Catch errors 
sessionStore.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

var routes = require('./server/routes/index'),
    rides = require('./server/routes/rides')(getIOInstance),
    users = require('./server/routes/users');

var port = process.env.PORT || 8005;



var cdta_api_stops = '?request=stops/';
var cdta_api_directions = '?request=directions/';
var cdta_api_sched = '?request=schedules/';
var cdta_api_status = '?request=status/';
var cdta_api_arrivals = '?request=arrivals/';
var cdta_api_key = process.env.cdta_api_key;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));

// Set up an Express session, which is required for CASAuthentication.
app.use(session({
    secret: 'super secret key',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: process.env.herokuurl || "http://localhost:" + port,
    cas_version: '2.0'
});

app.use('/', routes);
app.use('/rides', rides);
app.use('/user', users);

//CAS route handlers
app.get('/login', cas.bounce, function (req, res) {
	if (!req.session || !req.session.cas_user) {
    res.redirect('/#/');
  }
  res.cookie('user', req.session.cas_user);
  var collection = db.get().collection('users');
  collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
    if(err) throw err;
    if(docs.length == 1){
      res.redirect('/#/landing');
    }
    else{
      console.log('user does not exist');
      //logic to notify user and tell them to sign up
      res.redirect('/#/');
    }
  })
});

app.get('/signUp', cas.bounce, function(req,res){
  if(!req.session || !req.session.cas_user) {
    res.redirect('/#/');
  }
  var collection = db.get().collection('users');
  collection.find({rcs: req.session.cas_user}).toArray(function(err, docs){
    if(err) throw err;
    // console.log(docs.length);
    if(docs.length > 0) {
      console.log("User already exists");
      res.cookie('user', req.session.cas_user);
      //notify user that account alrady exists and log them in
      res.redirect('/#/landing');
    }
    else {
      res.redirect('/#/signUp');
      console.log('signUp');
    }
  })
});

app.get('/logout',function(req, res, next){
  if(!req.session || !req.session.cas_user){
    res.status(400).send('No user signed in');
  }
  else{
    next();
  }
}, cas.logout);

app.get('/cdta', function (req, resp) {
  var search = req.query.search_b;
  search= escape(search);

  var x = '';
  console.log("Search: " + search);
    http.get({
      host: 'api.cdta.org',
      path: '/api/v1/' + cdta_api_stops + search + cdta_api_key
    }, function (res) {
      var pt= '/api/v1/' + cdta_api_stops  + search + cdta_api_key;
      console.log(pt);
      res.on('data', function (d) {
          x += d.toString();
          console.log(d.toString());
      });
      res.on('end', function(){
          resp.send(x);
      });
    });
});

app.get('/cdta_dir', function (req, resp) {
  console.log("DIRECTIONS");
  var search = req.query.search_b;
  console.log(search);
  var x = '';
  http.get({
      host: 'api.cdta.org',
      path: '/api/v1/' + cdta_api_directions + search + cdta_api_key
  }, function (res) {
      res.on('data', function (d) {
        x += d.toString();
        console.log(d.toString());
      });
      res.on('end', function(){
        resp.send(x);
      });
  });
});


app.get('/get_route', function (req, resp) {
  console.log("ROUTE");
  var x= '';
  http.get({
      host: 'api.cdta.org',
      path: '/api/v1/' + cdta_api_sched + req.query.bus_num + '/weekday/' + req.query.info + cdta_api_key
  }, function (res) {
      res.on('data', function (d) {
        x += d.toString();
        console.log(d.toString());
      });
      res.on('end', function(){
        resp.send(x);
      });
  });
});


app.get('/service_status', function (req, resp) {
  console.log("This stuff: " + req.query.info);
  var x= '';
  http.get({
    host: 'api.cdta.org',
    path: '/api/v1/' + cdta_api_status + cdta_api_key
  }, function (res) {
      res.on('data', function (d) {
        x += d.toString();
        console.log(d.toString());
        res.destroy();
        return resp.send(x);
      });
  });
});

app.get('/stop_id', function (req, resp) {
  console.log("This stuff: " + req.query.info);
  var x= '';
  http.get({
    host: 'api.cdta.org',
    path: '/api/v1/' + cdta_api_arrivals + req.query.stopid + '/2' + cdta_api_key
  }, function (res) {
      res.on('data', function (d) {
        x += d.toString();
        console.log(d.toString());
      });
      res.on('end', function(){
        resp.send(x);
      });
  });
});


io.on("connection", function(socket){
  var cookie_string = socket.request.headers.cookie;
  if(session == undefined || typeof cookie_string == 'string'){
    var parsed_cookies = cookie.parse(cookie_string);
    var connect_sid = parsed_cookies['connect.sid'];
    var decoded_id = cookieParser.signedCookie(connect_sid, 'super secret key')

    socket.on('logged in', function(data){
      if(decoded_id) {
        sessionStore.get(decoded_id, function (error, session) {
          if(session && session.cas_user){
            socket.join(session.cas_user);
            db.get().collection('users').find({rcs: session.cas_user}).toArray(function(err, docs){//THIS NEEDS TO BE A SORTED AGGREGATE
            /*db.get.collection('users').aggregate([
              {$}
              ])*/
                db.get().collection('users').aggregate([
                  {$unwind : '$notifications'},
                  {$match: {'rcs': session.cas_user, 'notifications.seen': false}},
                  {$group: {
                    _id: '$_id', 
                    notifications: {$push: '$notifications'},
                  }}
                ]).toArray(function(err, docs2){
                  if(err) throw err;
                  if(docs2[0] == undefined){
                    socket.emit('notifications', {
                      notifications: docs[0].notifications,
                      count: 0
                    });
                  }
                  else{
                    socket.emit('notifications', {
                      notifications: docs[0].notifications,
                      count: docs2[0].notifications.length
                    });
                  }
                });
            });
          }
        });
      }
    });

    socket.on('update notifications', function(data){
      sessionStore.get(decoded_id, function(error, session){
          db.get().collection('users').find({rcs: session.cas_user}).toArray(function(err, docs){//THIS NEEDS TO BE A SORTED AGGREGATE
            db.get().collection('users').aggregate([
              {$unwind : '$notifications'},
              {$match: {'rcs': session.cas_user}, 'notifications.seen': false},
              {$group: {
                _id: '$_id', 
                notifications: {$push: '$notifications'},
              }}
            ]).toArray(function(err, docs2){
              if(err) throw err;
              if(docs2[0] == undefined){
                socket.emit('notifications', {
                  notifications: docs[0].notifications,
                  count: 0
                });
              }
              else{
                socket.emit('notifications', {
                  notifications: docs[0].notifications,
                  count: docs2[0].notifications.length
                });
              }
            });
          });
      });
    });
    socket.on('notifications seen', function(){
      sessionStore.get(decoded_id, function(error, session){
        if(error) throw error;
        db.get().collection('users').find({rcs: session.cas_user}).forEach(function(doc){
          doc.notifications.forEach(function(data){
             db.get().collection('users').update({rcs:session.cas_user, notifications:data}, {$set: {'notifications.$.seen': true}}, function(err, results){
              if(err) throw err;
            });
          });
        });
      })
    });
  }

});



db.connect(dbURI, function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1)
  } else {
    server.listen(port, function(){
      console.log('Server running on port ' + port + '.');
    })
  }
});
