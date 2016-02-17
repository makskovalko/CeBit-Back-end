var errorHandler = require('express-error-handler');
var logger = require('./logger');

module.exports = function (app) {
    return [
        function (err, req, res, next) {
            if (err) {
                if (process.env.NODE_ENV === 'test') {
                    return next(err);
                }
                err.status = err.status || 500;
                logger.log('error', err.status, {
                    message: err.message,
                    method: req.method,
                    url: req.url,
                    body: req.body,
                    ip: req.ip,
                });
                next(err);
            } else {
                next();
            }
        },
        errorHandler({
        server: app,
        handlers: {
            '500': function err500(err, req, res, next) {
                res.status(500);
                if (err.message) {
                    res.send({
                        error: 500,
                        message: err.message
                    });
                } else {
                    res.send({
                        error: 500,
                        message: 'Something unexpected happened. The problem has been logged and we\'ll look into it!'
                    });
                }
            },
            '503': function err503(err, req, res, next) {
                res.status(503);
                res.send({
                    error: 503,
                    message: 'We\'re experiencing heavy load, please try again later'
                });
            },
            '409': function err409(err, req, res, next) {
                res.status(409);
                if (err.message) {
                    res.send({
                        error: 409,
                        message: err.message
                    });
                } else {
                    res.send({
                        error: 409,
                        message: "The specified resource already exists"
                    });
                }
            },
            '405': function err405(err, req, res, next) {
                res.status(405).send({
                    error: 405,
                    message: "Method not allowed"
                });
            },
            '404': function err404(err, req, res, next) {
                res.status(404);
                if (err.message) {
                    res.send({
                        error: 404,
                        details: err.message
                    });
                } else {
                    res.send({
                        error: 404,
                        message: "Not Found"
                    });
                }
            },
            '401': function err401(err, req, res, next) {
                res.status(401);
                if (err.message) {
                    res.send({
                        error: 401,
                        message: err.message
                    });
                } else {
                    res.send({
                        error: 401,
                        message: "Unauthorized"
                    });
                }
            },
            '400': function err400(err, req, res, next) {
                res.status(400);
                if (err.message) {
                    res.send({
                        error: 400,
                        message: err.message
                    });
                } else {
                    res.send({
                        error: 400,
                        message: "Invalid request"
                    });
                }
            },
            '422': function err422(err, req, res, next) {
                res.status(422);
                if (err.message) {
                    res.send({
                        error: 422,
                        message: err.message,
                        fields: err.fields
                    });
                } else {
                    res.send({
                        error: 422,
                        message: "Invalid request"
                    });
                }
            }
        }
    })]
};
