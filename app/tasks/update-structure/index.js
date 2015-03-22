module.exports = function (structure, callback) {
  app.models.DataStructure
    .findOne({
      _id: structure._id
    })
    .exec(function (err, struct) {
      var promises;
      if (err) return callback(err);
      if (!struct) return callback('structure not found');

      struct.name           = structure.name;
      struct.validation     = structure.validation;
      struct.initialization = structure.initialization;

      struct.save(function (err, struct) {

        structure.operations = structure.operations || [];
        promises = structure.operations.map(function (operation) {
          return new Promise(function (resolve, reject) {

            if (operation._id) {

              // update operation
              app.models.Operation
                .findOne({
                  _id: operation._id
                }, operation, function (err, op) {
                  if (err) return reject(err);
                  resolve(op);
                });

            } else {

              // create operation
              app.models.Operation
                .create(operation, function (err, op) {
                  if (err) return reject(err);

                  struct.operations.push(op);
                  struct.save(function (err, struct) {
                    resolve(op.toObject());
                  });
                });
            }
          });
        });

        if (promises.length === 0) {
          callback(null, struct);
        } else {
          Promise
            .all(promises)
            .then(function (operations) {
              struct = struct.toObject();
              struct.operations = operations
              callback(null, struct);
            })
            .catch(function (err) {
              callback(err);
            });
        }

      });
    });
};