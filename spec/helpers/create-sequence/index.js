module.exports = function (callback) {
  app.models.Operation
    .create({
      validation: { type: 'string' }
    }, function (err, op) {
      app.models.DataStructure
        .create({
          validation: { type: 'string' },
          operations: [ op._id ]
        }, function (err, struct) {
          app.models.Sequence
            .create({
              type: struct._id,
              data: 'string',
              operations: [ 'string' ]
            }, function (err, seq) {
              callback({
                op: op._id,
                struct: struct._id,
                seq: seq._id
              });
            });
        });
    });
};