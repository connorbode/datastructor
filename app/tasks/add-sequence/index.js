module.exports = function (accountId, sequence, callback) {

  var operation;
  var validation;
  var valid;
  var validator;

  // find the data structure
  app.models.DataStructure
    .findOne({
      _id: app.db.Types.ObjectId(sequence.type)
    })
    .lean()
    .populate('operations')
    .exec(function (err, structure) {

      // validate datastructure
      if (err) { return callback(err); }
      if (!structure) { return callback('could not find datastructure'); }
      app.utils.schema.validate(sequence.data, structure.validation, function (errs) {
        if (errs) { return callback('data failed validation'); }

        // validate operations
        valid = true;
        _.forEach(sequence.operations, function (operation) {
          validator = _.filter(structure.operations, function (op) { 
            return op._id.toString() === operation.type.toString() 
          })[0];
          if (!validator) { valid = false; }
          else {
            validation = app.utils.schema.validate(operation.data, validator.validation);
            valid = validation.length === 0 ? valid : false;
          }
        });
        if (!valid) { return callback('operation failed validation'); }

        // add sequence
        app.models.Sequence
          .create(sequence, function (err, seq) {

            if (err) { return callback(err); }
            app.models.Account
              .findOne({
                _id: accountId
              })
              .populate('sequences')
              .exec(function (err, account) {

                if (err) { return callback(err); }
                if (!account) { return callback('account not found'); }
                account.sequences.push(seq._id);

                account.save(function (err, account) {
                  if (err) { return callback(err); }
                  callback(null, seq);
                });
              });
          });
      });
    });
};