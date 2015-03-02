describe('app.tasks.getStructure', function () {
  it('fails if the structure is not found', function (done) {
    app.tasks.getStructure('4edd40c86762e0fb12000003')
      .catch(function (err) {
        assert.equal(err, 'structure not found');
        done();
      });
  });

  it('passes the structure with operations', function (done) {
    var data = {};
    new Promise(function (resolve, reject) {
      app.models.Operation
        .create({
          validation: {
            name: 'mohammed'
          }
        }, {
          validation: {
            name: 'buddah'
          }
        }, function (err, op1, op2) {
          data.op1 = op1;
          data.op2 = op2;
          resolve({});
        });
    }).then(function () {
      return new Promise(function (resolve, reject) {
        app.models.DataStructure
          .create({
            name: 'struct', 
            validation: {
              name: 'jesus'
            },
            operations: [ data.op1, data.op2 ]
          }, function (err, struct) {
            data.struct = struct;
            resolve(true);
          });
      });
    }).then(function () {
      return app.tasks.getStructure(data.struct._id)
    }).then(function (struct) {
      assert.equal(data.struct.name, struct.name);
      assert.equal(struct.validation.name, struct.validation.name);
      assert.equal(struct.operations.length, 2);
      assert.equal(struct.operations[0].validation.name, 'mohammed');
      assert.equal(struct.operations[1].validation.name, 'buddah');
      done();
    }).catch(function (err) {
      console.log(err);
    });
  });
});