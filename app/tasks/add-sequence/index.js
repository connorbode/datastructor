module.exports = function (sequence, callback) {

  // add sequence
  app.models.Sequence
    .create(sequence, function (err, seq) {

      if (err) { return callback(err); }
      callback(null, seq);
    });
};