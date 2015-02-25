var colors = require('colors');

global.app = {};

require('./config')();

app.tasks = require('./tasks');
app.models = require('./models');
app.controllers = require('./controllers')();

app.routing.listen(3000);