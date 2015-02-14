module.exports = function (sequenceId, accountId, callback) {

  var matches;

  // remove the sequence
  app.models.Sequence
    .findOne({
      _id: sequenceId,
      owner: accountId
    })
    .exec(function (err, sequence) {
      if (err) { return callback(err); }
      if (!sequence) { return callback('sequence not found'); }

      sequence
        .remove(function (err) {
          if (err) { return callback(err); }
          callback(null);
        });
    });
};