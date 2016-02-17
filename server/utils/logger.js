var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({json: false, timestamp: true, colorize: true}),
        new (winston.transports.File)({ filename: __dirname + '/../../logs/runtime.log', json: false, colorize: true, name: 'all', maxsize: 10485760 }),
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({json: false, timestamp: true }),
        new (winston.transports.File)({ filename: __dirname + '/../../logs/exceptions.log', json: false, timestamp: true }),
    ],
    exitOnError: true
});

module.exports = logger;