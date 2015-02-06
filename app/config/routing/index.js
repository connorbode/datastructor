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
};