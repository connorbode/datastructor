describe('app.controllers.api.sequences.update', function () {
  it('fails if the user is not logged in', function (done) {
    session
      .put('/api/sequences/1')
      .end(function (err, res) {
        assert.equal(res.status, 401);
        assert.equal(res.body.errors[0], 'not logged in');
        done();
      });
  });

  it('fails if it cannot find the sequence', function (done) {
    helpers.session.create(function () {
      session
        .put('/api/sequences/4edd40c86762e0fb12000003')
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.errors[0], 'sequence not found');
          done();
        });
    });
  });

  it('returns the sequence after updating', function (done) {
    helpers.createSequence(function (IDs) {
      helpers.session.create(function (err, account) {
        app.models.Sequence
          .create({
            type: IDs.struct,
            data: 'string',
            owner: account._id,
            operations: [
              { type: IDs.op, data: 'string' }
            ]
          }, function (err, data) {
            session
              .put('/api/sequences/' + data._id)
              .send({
                data: 'some other string'
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.data, 'some other string');
                done();
              });
          });
      });
    });
  });
});