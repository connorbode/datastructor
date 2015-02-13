module.exports = function (sequence, callback) {

  var operation;
  var validation;
  var valid;

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
          validator = _.where(structure.operations, { '_id': operation.type })[0];
          validation = app.utils.schema.validate(operation.data, validator.validation);
          valid = validation.length === 0;
        });
        if (!valid) { return callback('operation failed validation'); }

        // add sequence
        app.models.Sequence
          .create(sequence, function (err, seq) {
            callback(null, seq);
          });
      });
    });
};