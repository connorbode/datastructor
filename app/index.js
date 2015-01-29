var express = require('express');
var validator = require('express-validator');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(validator());

var model = require('./models/index.js');
var controllers = require('./controllers/index.js')({
  app: app,
  model: model
});

app.listen(3000);