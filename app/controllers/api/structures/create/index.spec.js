describe('app.controllers.api.structures.create', function () {
  beforeEach(function (done) {
    helpers.session.create(done);
  });

  it('fails if name is not provided', function (done) {
    session
      .post('/api/structures')
      .end(function (err, res) {
        res.status.should.equal(400);
        done();
      });
  });

  it('adds a structure', function (done) {
    new Promise(function (resolve, reject) {
      session
        .post('/api/structures')
        .send({ name: 'fake' })
        .end(function (err, res) {
          if (err) return reject(err);
          res.body._id.should.not.be.empty;
          res.body.name.should.equal('fake');
          resolve(res.body);
        });
    }).then(function (response) {
      app.models.DataStructure
        .findOne({
          _id: response._id
        }, function (err, struct) {
          struct.should.not.be.a('null');

          struct.name.should.equal('fake');
          done();
        });
    });
  });
});