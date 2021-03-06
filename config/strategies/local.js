'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function() {

  passport.use(new LocalStrategy({
      usernameField: 'mobile',
      passwordField: 'password'
    },
    function(mobile, password, done) {
      User.findOne({
        mobile: mobile
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user or invalid password'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Unknown user or invalid password'
          });
        }

        return done(null, user);
      });
    }
  ));
};
