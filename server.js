//testing a js file for heroku
var routes = require('./server/routes/index'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	path = require('path'),
	CASAuthentication = require('cas-authentication'),
	session = require('express-session');
var express = require('express'),
    port = process.env.PORT || 8005,
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "format, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set up an Express session, which is required for CASAuthentication.
app.use(session({
    secret: 'super secret key',
    resave: false,
    saveUninitialized: true
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url: 'https://cas-auth.rpi.edu/cas',
    service_url: 'https://takemehometonight.herokuapp.com:', // trying with the herokuapp url
    cas_version: '2.0'
});

app.use('/', routes);


//CAS route handlers
app.get('/login', cas.bounce, function (req, res) {
  	if (!req.session || !req.session.cas_user) {
        res.redirect('/');
    }
    console.log(req.session);
    res.redirect('/#/landing');
});

app.get('/logout', cas.logout);

app.listen(port);
console.log('Server running on port ' + port + '.');
