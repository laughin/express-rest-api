'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');


/**
 * 用户列表
 */
exports.list = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

/**
 * 创建用户
 */
exports.create = function(req, res) {

  if (req.isAuthenticated()) {
    var user = new User(req.body);
    if (req.user.roles[0] === 'admin') {

      user.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(user);
        }
      });
    } else {
      res.status(400).send({
        'message': '没有权限'
      });
    }
  }

};

/**
 * 删除用户
 */
exports.delete = function(req, res) {
  var user = req.user;

  user.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(user);
    }
  });
};

/**
 * 根据用户ID查找用户
 */
exports.findOne = function(req, res) {
  User.findOne({
    _id: req.params.userID
  }, function(err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(user);
    }
  });
};

/**
 * 更新用户信息
 */
exports.update = function(req, res) {

  var user = req.user;
  var message = null;

  if (user) {
    user = _.extend(user, req.body);

    user.save(function(err) {
      if (err) {
        return res.status(res.statusCode).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.send({
              'error': 'An error has occurred - ' + err
            });
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(res.statusCode).send({
      message: '用户没有登陆'
    });
  }
};

exports.me = function(req, res) {
  res.json(req.user || null);
};
