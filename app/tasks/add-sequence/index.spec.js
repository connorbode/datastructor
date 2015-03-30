describe('app.tasks.add-sequence', function () {

  var accountId;

  beforeEach(function (done) {
    app.models.Account
      .create({
        name: 'hi',
        email: 'hi'
      }, function (err, account) {
        accountId = account._id;
        done();
      });
  });

  it('creates a sequence otherwise', function (done) {
    app.tasks.addSequence({
      type: 'test',
      data: 'string',
      operations: [
        { type: 'test', data: 'string' },
        { type: 'test', data: 4 }
      ]
    }, function (err, data) {
      assert.isNull(err);

      app.models.Sequence
        .findOne({ _id: data._id })
        .exec(function (err, seq) {
          assert.isNotNull(seq);
          done();
        });
    });
  });
});