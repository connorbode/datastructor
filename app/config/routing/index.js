var express = require('express');
var validator = require('express-validator');
var resource = require('express-resource');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function () {
  var public = path.join(__dirname + "/../../public");
  app.routing = express();
  app.routing.use(bodyParser.json());
  app.routing.use(validator({
    customValidators: {
      isProvider: function (value) {
        return app.sso[value];
      }
    }
  }));
  app.routing.sessionStore = new session.MemoryStore();
  app.routing.use(session({
    secret: 'datastruct mud trucks',
    resave: false,
    saveUninitialized: true,
    store: app.routing.sessionStore
  }));
  app.routing.use('/public', express.static(public));
};