describe('app.tasks.delete-sequence', function () {
  
  it('fails if the sequence is not found', function (done) {
    app.tasks.deleteSequence('4edd40c86762e0fb12000003', '4edd40c86762e0fb12000003', function (err) {
      assert.isNotNull(err);
      assert.equal(err, 'sequence not found');
      done();
    });
  });

  it('removes the sequence otherwise', function (done) {
    helpers.createSequence(function (IDs) {
      app.models.Account
        .create({
          email: 'hi',
          name: 'hi'
        }, function (err, account) {
          app.models.Sequence
            .create({
              data: 'string',
              type: IDs.struct,
              operations: [ { type: IDs.op, data: 'string' }],
              owner: account._id
            }, function (err, seq) {
              app.tasks.deleteSequence(seq._id, account._id, function (err) {
                assert.isNull(err);
                app.models.Sequence
                  .find({
                    _id: seq._id
                  })
                  .exec(function (err, sequences) {
                    assert.equal(sequences.length, 0);
                    done();
                  });
              });
            });
        });
    });
  });
});