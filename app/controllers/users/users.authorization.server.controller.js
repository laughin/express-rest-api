'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * 用户中间件
 */
exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) {
      return res.json({
        message: '不能转换ObjectId' + id
      });
    }
    if (!user) {
      return res.json({
        message: '没有找到用户 ' + id
      });
    }
    if (req.isAuthenticated()) {
      req.user = user;
    }
    next();
  });
};


/**
 * 登陆权限路由中间件
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(res.statusCode).send({
      message: '用户没有登陆'
    });
  }

  next();
};
