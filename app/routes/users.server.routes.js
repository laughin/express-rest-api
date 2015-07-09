'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/users.server.controller');
var config = require('../../config/config');

module.exports = function(app) {

  // User Routes
  app.route(config.app.restApiRoot + '/users').get(users.requiresLogin, users.list);
  app.route(config.app.restApiRoot + '/users').post(users.create);
  app.route(config.app.restApiRoot + '/users').put(users.requiresLogin, users.update);
  app.route(config.app.restApiRoot + '/users/me').get(users.me);
  app.route(config.app.restApiRoot + '/users/:userID').get(users.requiresLogin, users.findOne);
  app.route(config.app.restApiRoot + '/users/:userID').delete(users.requiresLogin, users.delete);
  app.route(config.app.restApiRoot + '/auth/signup').post(users.signup);
  app.route(config.app.restApiRoot + '/auth/signin').post(users.signin);
  app.route(config.app.restApiRoot + '/auth/signout').get(users.signout);
  app.route(config.app.restApiRoot + '/auth/login').post(users.login);

  // Finish by binding the user middleware
  app.param('userID', users.userByID);

};
