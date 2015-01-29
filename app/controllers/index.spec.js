var supertest = require('supertest');
var api = supertest('http://localhost:3000');

describe('controller', function () {
  describe('cat', function () {
    it('should create a cat', function (done) {
      api
        .post('/cats')
        .send({
          name: 'Connor'
        })
        .expect(200, done);
    });
  });
});