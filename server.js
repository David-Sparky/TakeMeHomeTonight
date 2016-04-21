//testing a js file for heroku
var routes = require('./server/routes/index'),
    rides = require('./server/routes/rides'),
    db = require('./server/db');
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	path = require('path'),
	CASAuthentication = require('cas-authentication'),
	session = require('express-session'),
    express = require('express'),
    port = 8005,
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));

// Set up an Express session, which is required for CASAuthentication.
app.use(session({
    secret: 'super secret key',
    resave: false,
    saveUninitialized: true
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: 'http://localhost:' + port,
    cas_version: '2.0'
});

app.use('/', routes);
app.use('/rides', rides);

//CAS route handlers
app.get('/login', cas.bounce, function (req, res) {
  	if (!req.session || !req.session.cas_user) {
        res.redirect('/');
    }
    console.log(req.session);
    res.redirect('/#/landing');
});

app.get('/logout', cas.logout);


db.connect('mongodb://' + process.env.tmhtDBUser + ':' + process.env.tmhtDBPassword + '@ds023418.mlab.com:23418/tmht', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(port, function() {
      console.log('Server running on port ' + port + '.')
    })
  }
});