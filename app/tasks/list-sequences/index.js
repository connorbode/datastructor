module.exports = function (limit, offset, callback) {
  app.models.Sequence
    .find()
    .skip(offset)
    .limit(limit)
    .exec(function (err, sequences) {
      return callback(err, sequences);
    });
};