module.exports = function (sequenceId, accountId, update, callback) {
  
  var validation;
  var valid;
  var validator;
  var type;

  app.models.Sequence
    .findOne({
      _id: sequenceId,
      owner: accountId
    })
    .exec(function (err, sequence) {
      if (err) { return callback(err); }
      if (!sequence) { return callback('sequence not found'); }

      // get datastructure
      if (update.type) {
        sequence.type = update.type;
      }

      app.models.DataStructure
        .findOne({
          _id: sequence.type
        })
        .populate('operations')
        .exec(function (err, struct) {
          if (err) { return callback(err); }
          if (!struct) { return callback('data structure not found'); }

          // validate datastructure
          if (global.stop) {
            debugger;
          }
          if (update.data !== undefined) {
            validation = app.utils.schema.validate(update.data, struct.validation);
            if (validation.length > 0) {
              return callback('data failed validation');
            }
            sequence.data = update.data;
          }

          // validate operations
          if (update.operations !== undefined) {
            valid = true;
            _.forEach(update.operations, function (operation) {
              validator = _.filter(struct.operations, function (op) { 
                return op._id.toString() === operation.type.toString() 
              })[0];
              if (!validator) { valid = false; }
              else {
                validation = app.utils.schema.validate(operation.data, validator.validation);
                valid = validation.length === 0 ? valid : false;
              }
            });
            if (!valid) { return callback('operation failed validation'); }
            sequence.operations = update.operations;
          }

          sequence.save(function (err) {
            if (err) { return callback(err); }
            return callback(null, sequence);
          });
        });
    });
};