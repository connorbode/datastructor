var colors = require('colors');
var port = process.env.PORT || 3000;

require('es6-promise').polyfill();

global.app = {};

require('./config')();

app.tasks = require('./tasks');
app.models = require('./models');
app.controllers = require('./controllers')();

app.routing.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.routing.listen(port);

console.log(('datastructor running on port ' + port).green);