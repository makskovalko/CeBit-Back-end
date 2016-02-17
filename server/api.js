var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('./utils/errorHandler');
var disallowMethods = require('./utils/methodsHandler');
var requestHandler = require('./utils/requestHandler');
var urlManager = require('./routes');
var cors = require('cors');
var errorFormatter = require('./utils/errorFormatter');
var config = require('../config');
var path = require('path');

//initialize the app
var app = module.exports = express();
app.use(cors());
//set up static files directory
app.use(express.static(__dirname + '/../frontend'));
app.use(express.static(__dirname + '/../frontend/doc'));
app.use(requestHandler);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));


urlManager(app);

//format errors
app.use(errorFormatter(app));
//set up http error handler
app.use(errorHandler(app));

disallowMethods(app);

process.on('uncaughtException', function (err, req, res) {
    console.log(err.stack);
});

process.on('SIGINT', function() {
    // calling shutdown allows your process to exit normally
    process.exit();
});