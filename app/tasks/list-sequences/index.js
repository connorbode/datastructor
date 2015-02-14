module.exports = function (params, callback) {
  app.models.Sequence
    .find()
    .skip(params.offset)
    .limit(params.limit)
    .exec(function (err, sequences) {
      return callback(err, sequences);
    });
};