var validator = require('./../../utils/bodyValidator');

module.exports = function validateQueryParams(req, res, next) {
    return validator({
        properties: {
            phone: {
                type: 'string',
                required: true,
                allowEmpty: false
            },
            name: {
                type: 'string',
                required: true,
                allowEmpty: false
            }
        },
        required: true
    })(req, res, next);
};