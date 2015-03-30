describe('app.tasks.update-sequence', function () {

  var accountId;
  var sequenceId;

  beforeEach(function (done) {
    app.models.Account
      .create({
        name: 'hi', 
        email: 'hi'
      }, function (err, account) {
        app.models.Sequence
          .create({
            type: 'test',
            data: 'string',
            owner: account._id,
            operations: [ { type: 'test', data: 'test hi there' } ]
          }, function (err, seq) {
            accountId = account._id;
            sequenceId = seq._id;
            done();
          });
      });
  });

  it('fails if the sequence is not found', function (done) {
    app.tasks.updateSequence('4edd40c86762e0fb12000003', '4edd40c86762e0fb12000003', {}, function (err, sequence) {
      assert.equal(err, 'sequence not found');
      done();
    });
  });

  it('updates the sequence', function (done) {
    var update = {
      type: 'test2',
      data: 5,
      operations: [
        { type: 'test1', data: 3 },
        { type: 'test2', data: 500 }
      ]
    };

    app.tasks.updateSequence(sequenceId, accountId, update, function (err, sequence) {
      assert.equal(sequence.data, 5);
      assert.equal(sequence.type, 'test2');
      assert.equal(sequence.operations.length, 2);
      assert.equal(sequence.operations[0].data, 3);
      assert.equal(sequence.operations[1].data, 500);
      done();
    });
  });
});