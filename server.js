//testing a js file for heroku
var routes = require('./server/routes/index'),
    rides = require('./server/routes/rides'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	path = require('path'),
	CASAuthentication = require('cas-authentication'),
	session = require('express-session');
var express = require('express'),
    port = process.env.PORT || 8005,
    app = express();

var cdta= require('./client/controllers/api_info.js');
var http= require('http');

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
    service_url: 'https://takemehometonight.herokuapp.com',
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

app.get('/cdta', function (req, resp) {

    var search = req.query.search_b;

    console.log(search);

    // http.get(cdta.api_time + '/' + search + cdta.api_key, function (callback) {
    //
    //     callback.on('data', function(d) {
    //         console.log(d);
    //     })
    //
    //
    // });

    var x = '';
        http.get({
            host: 'api.cdta.org',
            path: '/api/v1/' + cdta.api_stops + '/' + search + cdta.api_key
        }, function (res) {
            res.on('data', function (d) {
                x += d.toString();
                console.log(d.toString());
                res.destroy();
                return resp.send(x);
            });

        });

});

app.get('/cdta_dir', function (req, resp) {

    var search = req.query.search_b;

    console.log(search);

    // http.get(cdta.api_time + '/' + search + cdta.api_key, function (callback) {
    //
    //     callback.on('data', function(d) {
    //         console.log(d);
    //     })
    //
    //
    // });

    var x = '';
    http.get({
        host: 'api.cdta.org',
        path: '/api/v1/' + cdta.api_directions + search + cdta.api_key
    }, function (res) {
        res.on('data', function (d) {
            x += d.toString();
            console.log(d.toString());
            res.destroy();
            return resp.send(x);
        });

    });

});

app.get('/get_route', function (req, resp) {

    console.log("This stuff: " + req.query.info);
    var x= '';
    http.get({
        host: 'api.cdta.org',
        path: '/api/v1/' + cdta.api_sched + req.query.bus_num + '/weekday/' + req.query.info + cdta.api_key
    }, function (res) {
        res.on('data', function (d) {
            x += d.toString();
            console.log(d.toString());
            res.destroy();
            return resp.send(x);
        });

    });

});



app.listen(port);
console.log('Server running on port ' + port + '.');
