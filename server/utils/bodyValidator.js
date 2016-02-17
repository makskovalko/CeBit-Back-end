var revalidator = require('revalidator');

function createError(code, message) {
    var err = new Error();
    err.status = code;
    err.message = message;
    return err;
}

function getRequestBody(req) {
    switch (req.method) {
        case 'GET':
            return req.query || {};

        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
            return req.body || {};
    }

    return false;
}

module.exports = function bodyValidator(schema) {
    return function (req, res, next) {
        if (schema) {
            var data = getRequestBody(req);
            if (!data) {
                res.status(400).send({
                    error: 400,
                    message:'bodyValidator does not support ' + req.method + ' requests'
                })
            } else {
                var result = revalidator.validate(data, schema);
                if (!result.valid) {
                    message = [
                        result.errors[0].property,
                        result.errors[0].message,
                    ].join(' ');

                    res.status(400).send({
                        error: 400,
                        message:message
                    })

                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
};