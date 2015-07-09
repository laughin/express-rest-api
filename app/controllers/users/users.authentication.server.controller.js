'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  config = require('../../../config/config'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  User = mongoose.model('User');


/**
 * 获取认证Token
 */
exports.authenticate = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      var token = jwt.sign(user, config.secret, {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
  })(req, res, next);
};

/**
 * 注册
 */
exports.signup = function(req, res) {

  var user = new User(req.body);
  var message = null;

  user.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          res.json({
            success: false,
            message: err
          });
        } else {
          res.json({
            success: true,
            user: user
          });
        }
      });
    }
  });
};

/**
 * 登陆
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          res.json({
            success: false,
            message: err
          });
        } else {
          res.json({
            success: true,
            user: user
          });
        }
      });
    }
  })(req, res, next);
};

/**
 * 管理员登陆
 */
exports.login = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      if (user.roles[0] === 'admin') {
        req.login(user, function(err) {
          if (err) {
          res.json({
            success: false,
            message: err
          });
        } else {
          res.json({
            success: true,
            user: user
          });
        }
        });
      } else {
        res.status(400).send({
          'message': '只有管理员权限才可以登录'
        });
      }

    }
  })(req, res, next);
};


/**
 * 登出
 */
exports.signout = function(req, res) {
  req.logout();
  res.json({
    message: 'signout success'
  });
};
