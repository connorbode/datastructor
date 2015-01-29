var express = require('express');
var expressValidator = require('express-validator');
var expressResource = require('express-resource');
var bodyParser = require('body-parser');
var app = {};

app.routing = express();
app.routing.use(bodyParser.json());
app.routing.use(expressValidator());

app.db = require('mongoose');
app.db.connect('mongodb://localhost:27017/datastructor');

app.models = require('./models')(app);
// app.controllers = require('./controllers')(app);

app.routing.listen(3000);