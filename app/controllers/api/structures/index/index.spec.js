describe('app.controllers.api.structures.index', function () {
  it('returns all datastructures', function (done) {
    new Promise(function (resolve, reject) {
      helpers.session.create(function (err, data) {
        resolve(data);
      });
    }).then(function (data) {
      return new Promise(function (resolve, reject) {
        app.models.DataStructure.create({
          name: 'a test structure',
          validation: {
            test: 'data'
          }
        }, function (err, struct) {
          resolve(struct);
        });
      });
    }).then(function (struct) {
      session
        .get('/api/structures')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].name, 'a test structure');
          assert.equal(res.body[0].validation.test, 'data');
          done();
        });
    });
  });
});