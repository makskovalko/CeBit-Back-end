/*
* Usage: /*return next(new Error('{"status": 400, "fields": [{"id": null}]}'));
* For sequelize errors just pass sequelize error object like this:
* users.create(req.body)
    .catch(function (error) {
    return next(error);
    });
*
*/

module.exports = function (app) {

    var handleSequelizeErrors = function(err) {

        if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            err.status = 422;
            var fields = [];

            for(var i = 0; i < err.errors.length; i++) {
                fields.push({
                    field: err.errors[i].path,
                    message: err.errors[i].message
                })
            }
            err.fields = fields;
        }
    };

    return [
        function (err, req, res, next) {
            try {
                var error = JSON.parse(err.message);
            }
            catch(e) {
                handleSequelizeErrors(err);
                return(next(err));
            }

            err.status = error.status;
            err.message = '';
            err.fields = [];

            if(error.message)
                err.message = error.message;

            if(error.fields)
                err.fields = error.fields;

            err.isError = 1;
            if(err)
                return next(err);

            return next();
        }
    ]
}