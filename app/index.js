var app = {};

require('./config')(app);

app.tasks = require('./tasks')(app);
app.models = require('./models')(app);
app.controllers = require('./controllers')(app);

app.routing.listen(3000);