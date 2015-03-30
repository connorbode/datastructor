describe('app.tasks.get-sequence', function () {
  
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