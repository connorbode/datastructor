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

  it('fails if the data-structure is not found', function (done) {
    app.tasks.addSequence({
      type: '4edd40c86762e0fb12000003'
    }, function (err, data) {
      assert.isNotNull(err);
      done();
    });
  });

  it('fails if the validation for the data fails', function (done) {
    app.models.DataStructure
      .create({
        validation: {
          type: 'object',
          properties: {
            age: {
              type: 'number'
            },
            name: {
              type: 'string'
            }
          }
        }
      }, function (err, struct) {
        app.tasks.addSequence({
          type: struct._id,
          data: {
            age: 'not a number',
            name: 9
          }
        }, function (err, data) {
          assert.isNotNull(err);
          done();
        });
      });
  });

  it('fails if the validations for the operations fail', function (done) {
    app.models.Operation
      .create({ 
        validation: { type: 'string' } 
      }, {
        validation: { type: 'number' } 
      }, function (err, op1, op2) {
        app.models.DataStructure
          .create({
            validation: { type: 'string' },
            operations: [ op1._id, op2._id ]
          }, function (err, struct) {
            app.tasks.addSequence({
              type: struct._id,
              data: 'string',
              operations: [
                { type: op1._id, data: 'string' },
                { type: op2._id, data: 'string' }
              ]
            }, function (err, data) {
              assert.isNotNull(err);
              done();
            });
          });
      });
  });

  it('creates a sequence otherwise', function (done) {
    app.models.Operation
      .create({
        validation: { type: 'string' }
      }, {
        validation: { type: 'number' }
      }, function (err, op1, op2) {
        app.models.DataStructure
          .create({
            validation: { type: 'string' },
            operations: [ op1._id, op2._id ]
          }, function (err, struct) {
            app.tasks.addSequence({
              type: struct._id,
              data: 'string',
              operations: [
                { type: op1._id, data: 'string' },
                { type: op2._id, data: 4 }
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
  });
});