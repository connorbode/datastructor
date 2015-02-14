describe('app.tasks.update-sequence', function () {

  var accountId;
  var sequenceId;
  var operationId;

  beforeEach(function (done) {
    helpers.createSequence(function (IDs) {
      app.models.Account
        .create({
          name: 'hi', 
          email: 'hi'
        }, function (err, account) {
          app.models.Sequence
            .create({
              type: IDs.struct,
              data: 'string',
              owner: account._id,
              operations: [ IDs.op ]
            }, function (err, seq) {
              accountId = account._id;
              sequenceId = seq._id;
              operationId = IDs.op;
              done();
            });
        });
    });
  });

  it('fails if the sequence is not found', function (done) {
    app.tasks.updateSequence('4edd40c86762e0fb12000003', '4edd40c86762e0fb12000003', {}, function (err, sequence) {
      assert.equal(err, 'sequence not found');
      done();
    });
  });

  it('fails if the type is not found', function (done) {
    app.tasks.updateSequence(sequenceId, accountId, { type: '4edd40c86762e0fb12000003'}, function (err, sequence) {
      assert.equal(err, 'data structure not found');
      done();
    });
  });

  it('fails if the data update fails validation', function (done) {
    app.tasks.updateSequence(sequenceId, accountId, { data: 0 }, function (err, sequence) {
      assert.equal(err, 'data failed validation');
      done();
    });
  });

  it('fails if the operation update fails validation', function (done) {
    var update = {
      operations: [
        { type: operationId, data: 0 }
      ]
    };
    app.tasks.updateSequence(sequenceId, accountId, update, function (err, sequence) {
      assert.equal(err, 'operation failed validation');
      done();
    });
  });

  it('updates the sequence', function (done) {
    var update = {};
    app.models.Operation
      .create({
        validation: {
          type: 'number'
        }
      }, function (err, op) {
        app.models.DataStructure
          .create({
            validation: {
              type: 'number'
            },
            operations: [ op._id ]
          }, function (err, struct) {
            update.type = struct._id;
            update.data = 5;
            update.operations = [
              { type: op._id, data: 3 },
              { type: op._id, data: 500 }
            ];
            app.tasks.updateSequence(sequenceId, accountId, update, function (err, sequence) {
              assert.equal(sequence.data, 5);
              assert.equal(sequence.type, struct._id);
              assert.equal(sequence.operations.length, 2);
              assert.equal(sequence.operations[0].data, 3);
              assert.equal(sequence.operations[1].data, 500);
              done();
            });
          });
      });
  });
});