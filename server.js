//testing a js file for heroku
var routes = require('./server/routes/index');

var express = require('express'),
    port = 8005,
    app = express();

app.use('/', routes);

app.listen(port);
console.log('Server running on port ' + port + '.');