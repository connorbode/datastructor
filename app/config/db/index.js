module.exports = function (app) {
  app.db = require('mongoose');
  app.db.connect('mongodb://localhost:27017/datastructor');
  app.db.connection.on('error', function (err) {
    // log, maybe?
  });
};