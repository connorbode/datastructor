describe('app.tasks.get-sequence', function () {
  
  var operationId;
  var structureId;

  beforeEach(function (done) {
    app.models.Operation
      .create({
        validation: { type: 'string' }
      }, function (err, op) {
        app.models.DataStructure
          .create({
            validation: { type: 'string' },
            operations: [ op._id ]
          }, function (err, struct) {
            operationId = op._id;
            structureId = struct._id;
            done();
          });
      });
  });

  it('passes an error back if the sequence is not found', function (done) {
    app.tasks.getSequence('4edd40c86762e0fb12000003', function (err, sequence) {
      assert.isNotNull(err);
      done();
    });
  });

  it('passes the sequence back if it is found', function (done) {
    app.models.Sequence
      .create({
        data: 'fake',
        name: 'fake',
        operations: ['fake']
      }, function (err, seq) {
        app.tasks.getSequence(seq._id, function (err, sequence) {
          assert.isNull(err);
          assert.isNotNull(sequence);
          done();
        });
      });
  });
});