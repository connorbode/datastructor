var colors = require('colors');
var port = 3000;

global.app = {};

require('./config')();

app.tasks = require('./tasks');
app.models = require('./models');
app.controllers = require('./controllers')();

app.routing.listen(port);

console.log(('datastructor running on port ' + port).green);