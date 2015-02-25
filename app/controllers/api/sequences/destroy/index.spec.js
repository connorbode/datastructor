describe('app.controllers.api.sequences.destroy', function () {

  it('fails if the user is not logged in', function (done) {
    session
      .delete('/api/sequences/1')
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.isDefined(res.body.errors);
        done();
      });
  });

  it('fails if the sequence does not exist', function (done) {
    helpers.session.create(function () {
      session
        .delete('/api/sequences/4edd40c86762e0fb12000003')
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.body.errors[0], 'sequence not found');
          done();
        });
    });
  });

  it('deletes the sequence', function (done) {
    helpers.session.create(function (err, account) {
      helpers.createSequence(function (IDs) {
        app.models.Sequence
          .create({
            type: IDs.struct,
            data: 'string',
            owner: account._id
          }, function (err, sequence) {
            session
              .delete('/api/sequences/' + sequence._id)
              .end(function (err, res) {
                assert.equal(res.status, 204);
                app.models.Sequence
                  .find({
                    _id: sequence._id
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