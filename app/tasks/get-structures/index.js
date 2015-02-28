module.exports = function (email, callback) {
  app.models.DataStructure
    .find()
    .exec(function (err, datastructures) {
      if (err) { return callback(err); }
      callback(null, datastructures);
    });
};