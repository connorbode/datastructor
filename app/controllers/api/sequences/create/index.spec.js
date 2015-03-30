describe('app.controllers.api.sequences.create', function () {

  it('fails if the user is not logged in', function (done) {
    session
      .post('/api/sequences')
      .send({
        name: 'fake',
        data: 'fake',
        operations: [
          { type: 'test', data: 'fake' }
        ],
        type: 'test'
      })
      .end(function (err, res) {
        assert.equal(res.status, 401);
        done();
      });
  });

  it('fails if the appropriate params are not provided', function (done) {
    helpers.session.create(function () {
      session
        .post('/api/sequences')
        .end(function (err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });
  });

  it('succeeds if the appropriate params are provided', function (done) {
    helpers.session.create(function () {
      session
        .post('/api/sequences')
        .send({
          name: 'fake',
          data: 'fake',
          operations: [
            { type: 'test', data: 'fake' }
          ],
          type: 'test'
        })
        .end(function (err, res) {
          assert.equal(res.status, 201);
          app.models.Sequence
            .findOne({
              _id: res.body._id
            })
            .exec(function (err, seq) {
              assert.isNotNull(seq);
              done();
            });
        });
    });
  });
});