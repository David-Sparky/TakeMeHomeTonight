//testing a js file for heroku
var routes = require('./server/routes/index'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	path = require('path');
var express = require('express'),
    port = 8005,
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '/')));


app.use('/', routes);

app.listen(port);
console.log('Server running on port ' + port + '.');