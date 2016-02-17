var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
//var userModel = require('../models').users;
//var crypt = require('../utils/crypt');
var Token = require('../utils/tokenHelper');
var users = require('./../models').users;

var passportHandle = passport.use(new Strategy(
    function(token, cb) {

        var decrypted = Token.decrypt(token);

        users.findById(decrypted.id)
            .then(function(user) {
                if (!user) { return cb(null, false); }
                return cb(null, user);
            })
            .catch(function(err) {
                return cb(err);
            });
    }));

module.exports = passportHandle;