describe('app.tasks.listStructures', function () {
  it('returns the appropriate data structures', function (done) {
    new Promise(function (resolve, reject) {
      app.models.DataStructure.create({
        name: 'a test structure',
        validation: {
          name: 'fake'
        }
      }, function (err, struct) {
        resolve(struct);
      });
    }).then(function (struct) {
      app.tasks.listStructures('email', function (err, structures) {
        assert.equal(structures.length, 1);
        assert.equal(structures[0].name, struct.name);
        assert.equal(structures[0].validation.name, struct.validation.name);
        done();
      });
    });
  });
});