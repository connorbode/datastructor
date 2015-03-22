describe('app.controllers.api.structures.update', function () {
  beforeEach(function (done) {
    helpers.session.create(done);
  });

  it('updates a structure', function (done) {
    new Promise(function (resolve, reject) {
      app.models.Operation
        .create({
          operation: 'test',
          validation: {
            test: 'test'
          },
          name: 'test'
        }, function (err, op) {
          resolve(op);
        });
    }).then(function (operation) {
      return new Promise(function (resolve, reject) {
        app.models.DataStructure
          .create({
            initialization: 'test',
            validation: {
              test: 'test'
            },
            name: 'test',
            operations: [ operation._id ]
          }, function (err, struct) {
            resolve(struct);
          });
      });
    }).then(function (struct) {
      return new Promise(function (resolve, reject) {
        session
          .put('/api/structures/' + struct._id)
          .send({
            initialization: 'updated',
            validation: {
              test: 'updated'
            },
            name: 'updated',
            operations: [
              { _id: struct.operations[0], operation: 'updated', validation: { test: 'updated' } },
              { operation: 'updated', validation: { test: 'updated' } }
            ]
          })
          .end(function (err, res) {
            res.body.name.should.equal('updated');
            res.body.validation.test.should.equal('updated');
            res.body.initialization.should.equal('updated');
            res.body.operations.length.should.equal(2);
            res.body.operations[0].operation.should.equal('updated');
            res.body.operations[1].operation.should.equal('updated');
            res.body.operations[0].validation.test.should.equal('updated');
            res.body.operations[1].validation.test.should.equal('updated');
            done();
          });
      });
    });
  });
});