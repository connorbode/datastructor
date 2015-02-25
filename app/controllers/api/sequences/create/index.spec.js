describe('app.controllers.api.sequences.create', function () {

  var operationId;
  var structureId; 

  beforeEach(function (done) {
    app.models.Operation
      .create({
        validation: { type: 'string' }
      }, function (err, op) {
        operationId = op._id;

        app.models.DataStructure
          .create({
            validation: { type: 'string' },
            operations: [ operationId ]
          }, function (err, struct) {
            structureId = struct._id;
            done();
          });
      });
  });

  it('fails if the user is not logged in', function (done) {
    session
      .post('/api/sequences')
      .send({
        name: 'fake',
        data: 'fake',
        operations: [
          { type: operationId, data: 'fake' }
        ],
        type: structureId
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        done();
      });
  });

  it('fails if the operation type is not sent', function (done) {
    session
      .post('/api/sequences')
      .send({
        name: 'fake', 
        data: 'fake',
        operations: [
          'fake'
        ],
        type: structureId
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
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
            { type: operationId, data: 'fake' }
          ],
          type: structureId
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