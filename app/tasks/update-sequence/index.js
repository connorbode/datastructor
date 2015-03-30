module.exports = function (sequenceId, accountId, update, callback) {
  
  var validation;
  var valid;
  var validator;
  var type;

  app.models.Sequence
    .findOneAndUpdate({
      _id: sequenceId,
      owner: accountId
    }, update)
    .exec(function (err, sequence) {
      if (err) { return callback(err); }
      if (!sequence) { return callback('sequence not found'); }
        
      return callback(null, sequence);
    });
};