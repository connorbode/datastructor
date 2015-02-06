var express = require('express');
var expressValidator = require('express-validator');
var expressResource = require('express-resource');
var bodyParser = require('body-parser');

module.exports = function (app) {
  app.routing = express();
  app.routing.use(bodyParser.json());
  app.routing.use(expressValidator({
    customValidators: {
      isProvider: function (value) {
        return app.sso[value];
      }
    }
  }));

  app.db = require('mongoose');
  app.db.connect('mongodb://localhost:27017/datastructor');

  app.sso = {};
  app.sso.github = require('octonode');
  app.sso.github.auth.config({ id: process.env.GITHUB_CLIENT_ID, secret: process.env.GITHUB_CLIENT_SECRET });
};