var jwt = require('jsonwebtoken');
var config = require('./../../config');

var Token = function(){};

Token.encrypt = function(payload) {
    return 'Bearer ' +  jwt.sign(payload, config.security.signature);
};

Token.decrypt = function(encrypted) {
    try {
        return jwt.verify(encrypted, config.security.signature);
    } catch (e) {
        return false;
    }
};

module.exports = Token;