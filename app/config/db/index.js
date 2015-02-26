module.exports = function () {
  app.db = require('mongoose');
  app.db.connect(process.env.MONGO || 'mongodb://localhost:27017/datastructor');
  app.db.connection.on('error', function (err) {
    console.log('error connecting to mongo'.red);
  });
};
