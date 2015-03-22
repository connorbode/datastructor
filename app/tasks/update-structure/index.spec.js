describe('app.tasks.updateStructure', function () {
  it('throws an error if the structure is not found', function (done) {
    app.tasks.updateStructure({
      _id: '4edd40c86762e0fb12000003'
    }, function (err, data) {
      err.should.not.be.a('null');
      err.should.equal('structure not found');
      done();
    });
  });

  it('updates the structures details', function (done) {
    new Promise(function (resolve, reject) {
      app.models.DataStructure
        .create({
          name: 'test',
          validation: {
            'test': 'test'
          },
          initialization: 'test'
        }, function (err, struct) {
          resolve(struct);
        });
    }).then(function (struct) {
      return new Promise(function (resolve, reject) {
        app.tasks.updateStructure({
          _id: struct._id,
          name: 'updated',
          validation: {
            'test': 'updated',
          },
          initialization: 'updated'
        }, function (err, struct) {
          struct.name.should.equal('updated');
          struct.validation.test.should.equal('updated');
          struct.initialization.should.equal('updated');
          resolve(struct);
        });
      });
    }).then(function (struct) {
      app.models.DataStructure
        .findOne({
          _id: struct._id
        })
        .exec(function (err, struct) {
          struct.name.should.equal('updated');
          struct.validation.test.should.equal('updated');
          struct.initialization.should.equal('updated');
          done();
        });
    });
  });

  it('adds new operations', function (done) {
    new Promise(function (resolve, reject) {
      app.models.DataStructure
        .create({
          name: 'test'
        }, function (err, struct) {
          resolve(struct);
        });
    }).then(function (struct) {
      return new Promise(function (resolve, reject) {
        app.tasks.updateStructure({
          _id: struct._id,
          operations: [
            { name: 'test', operation: 'test', validation: { test: 'test' } },
            { name: 'test2', operation: 'test2', validation: {test: 'test2' } }
          ]
        }, function (err, struct) {
          struct.operations.length.should.equal(2);
          struct.operations[0].name.should.equal('test');
          struct.operations[0].operation.should.equal('test');
          struct.operations[0].validation.test.should.equal('test');
          struct.operations[0]._id.should.not.be.a('undefined');
          resolve(struct);
        });
      });
    }).then(function (struct) {
      app.models.DataStructure
        .findOne({
          _id: struct._id
        })
        .populate('operations')
        .exec(function (err, dataStructure) {
          dataStructure.operations.length.should.equal(2);
          dataStructure.operations[0].name.should.equal('test');
          dataStructure.operations[0].operation.should.equal('test');
          dataStructure.operations[0].validation.test.should.equal('test');
          dataStructure.operations[0]._id.should.not.be.a('undefined');
          dataStructure.operations[1].name.should.equal('test2');
          dataStructure.operations[1].operation.should.equal('test2');
          dataStructure.operations[1].validation.test.should.equal('test2');
          dataStructure.operations[1]._id.should.not.be.a('undefined');
          done();
        });
    });
  });

  it('updates operations', function (done) {
    new Promise(function (resolve, reject) {
      app.models.Operation
        .create({
          name: 'test',
          operation: 'test',
          validation: { test: 'test' }
        }, function (err, op) {
          resolve(op);
        });
    }).then(function (operation) {
      return new Promise(function (resolve, reject) {
        app.models.DataStructure
          .create({
            name: 'test',
            initialization: 'test',
            validation: {
              test: 'test'
            },
            operations: [ operation ]
          }, function (err, struct) {
            resolve(struct);
          });
      });
    }).then(function (struct) {
      return new Promise(function (resolve, reject) {
        app.tasks.updateStructure({
          _id: struct._id,
          name: 'updated',
          initialization: 'updated',
          validation: {
            test: 'updated'
          },
          operations: [
            { _id: struct.operations[0], operation: 'updated', name: 'updated' },
            { operation: 'updated', name: 'updated' }
          ]
        }, function (err, struct) {
          struct.name.should.equal('updated');
          struct.initialization.should.equal('updated');
          struct.validation.test.should.equal('updated');
          struct.operations.length.should.equal(2);
          done();
        });
      });
    });
  });

});