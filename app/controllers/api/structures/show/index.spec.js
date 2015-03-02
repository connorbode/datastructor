describe('app.controllers.structures.show', function () {
  it('fails if the user is not logged in', function (done) {
    session
      .get('/api/structures/1')
      .end(function (err, res) {
        res.status.should.equal(401);
        done();
      });
  });

  it('fails if the structure is not found', function (done) {
    helpers.session.create(function () {
      session
        .get('/api/structures/4edd40c86762e0fb12000003')
        .end(function (err, res) {
          res.status.should.equal(400);
          res.body.errors[0].should.equal('structure not found');
          done();
        });
    });

    it('retrieves a structure', function (done) {
      new Promise(function (resolve, reject) {
        app.models.Operation.create({
          validation: {
            name: 'charlie'
          }
        }, function (err, op) {
          resolve(op);
        });
      }).then(function (op) {
        return new Promise(function (resolve, reject) {
          app.models.DataStructure.create({
            name: 'dave',
            validation: {
              name: 'dave'
            },
            operations: [ op._id ]
          }, function (err, struct) {
            resolve(struct);
          });
        });
      }).then(function (struct) {
        session
          .get('/api/structures/' + struct._id)
          .end(function (err, res) {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal('dave');
            expect(res.body.operations.length).to.equal(1);
            done();
          })
      });
    });
  });
});