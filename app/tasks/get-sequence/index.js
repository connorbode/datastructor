module.exports = function (id, callback) {
  app.models.Sequence
    .findOne({
      _id: id
    })
    .lean()
    .exec(function (err, sequence) {
      if (!sequence) { return callback('sequence not found'); }
      return callback(err, sequence);
    });
};