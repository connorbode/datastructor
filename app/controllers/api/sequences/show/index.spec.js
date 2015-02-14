describe('app.controllers.api.sequences.show', function () {
  
  it('fails if not logged in', function (done) {
    session
      .get('/api/sequences/1')
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.errors[0], 'not logged in');
        done();
      });
  });

  it('returns an error if the sequence is not found', function (done) {
    helpers.session.create(function () {
      session
        .get('/api/sequences/1')
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.errors[0], 'sequence not found');
          done();
        })
    });
  });

  it('returns the sequence if found', function (done) {
    helpers.session.create(function () {
      helpers.createSequence(function (IDs) {
        var url = '/api/sequences/' + IDs.seq;
        session
          .get(url)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, IDs.seq);
            done();
          });
      });
    });
  });
});