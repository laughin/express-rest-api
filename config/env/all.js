'use strict';

module.exports = {
  app: {
    title: 'teamun-api',
    description: 'teamun server side RESTFul API',
    keywords: 'team, game, 1 2 3 together, all in, go big or go home',
    restApiRoot: '/api'
  },
  port: process.env.PORT || 3000,
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions'
};
