describe('app.controllers.api.sequences.index', function () {

  var ids = {};

  beforeEach(function (done) {
    app.models.Sequence
      .create({
        name: 'one',
        type: 'test'
      }, {
        name: 'two',
        type: 'test'
      }, {
        name: 'three',
        type: 'test'
      }, {
        name: 'four',
        type: 'test'
      }, {
        name: 'five',
        type: 'test'
      }, {
        name: 'six',
        type: 'test'
      }, {
        name: 'seven',
        type: 'test'
      }, {
        name: 'eight',
        type: 'test'
      }, {
        name: 'nine',
        type: 'test'
      }, {
        name: 'ten',
        type: 'test'
      }, {
        name: 'eleven',
        type: 'test'
      }, function (err, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11) {
        ids = {
          s1: s1._id,
          s2: s2._id,
          s3: s3._id, 
          s4: s4._id,
          s5: s5._id,
          s6: s6._id,
          s7: s7._id,
          s8: s8._id,
          s9: s9._id,
          s10: s10._id,
          s11: s11._id
        };
        done();
      });
  });
  
  it('fails if the user is not logged in', function (done) {
    session
      .get('/api/sequences')
      .end(function (err, res) {
        assert.equal(res.status, 401);
        done();
      });
  });

  it('retrieves 10 resources by default', function (done) {
    helpers.session.create(function () {
      session
        .get('/api/sequences')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 10);
          assert.equal(res.body[9]._id, ids.s10);
          done();
        });
    });
  });

  it('can set limit in request', function (done) {
    helpers.session.create(function () {
      session
        .get('/api/sequences?limit=3')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 3);
          done();
        });
    });
  });

  it('can set the offset', function (done) {
    helpers.session.create(function () {
      session
        .get('/api/sequences?offset=1')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[9]._id, ids.s11);
          done();
        });
    });
  });

  it('reduces the limit to max limit if the provided limit exceeds max limit', function (done) {
    helpers.session.create(function () {
      session
        .get('/api/sequences?limit=1000')
        .end(function (err, res) {
          assert.equal(res.body.length, 10);
          done();
        });
    });
  });
});