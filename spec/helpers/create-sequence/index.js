module.exports = function (callback) {
  app.models.Sequence
    .create({
      type: 'test',
      data: 'string',
      operations: [ 'string' ]
    }, function (err, seq) {
      callback(seq._id);
    });
};