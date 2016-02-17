var app = require('./server/api');
var config = require('./config');
var rConcole = require('./server/utils/logger');

var server = app.listen(config.server.port, config.server.host, function () {
    rConcole.log("info", "web server is available at http://%s:%s", config.server.host, config.server.port);
});

module.exports.app = app;