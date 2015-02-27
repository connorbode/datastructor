describe('app.controllers.api.sessions', function () {
  describe('create', function () {
    it('should fail if there is no code sent', function (done) {
      session
        .post('/api/sessions')
        .send({
          provider: 'fake'
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });

    it('should fail if there is no provider sent', function (done) {
      session
        .post('/api/sessions')
        .send({
          code: 'fake'
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });

    it('should fail if an invalid provider is sent', function (done) {
      session
        .post('/api/sessions')
        .send({
          code: 'fake',
          provider: 'fake'
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });

    it('returns 400 if oauth authentication fails', function (done) {
      nock('https://github.com')
        .post('/login/oauth/access_token')
        .reply(404);

      session
        .post('/api/sessions')
        .send({
          code: 'fake',
          provider: 'github'
        })
        .end(function (err, res) {
          assert.equal(res.status, 400);
          done();
        });
    });

    it('successfully logs a user in', function (done) {
      var identity;
      var account;
      var sessionId;
      identity = new app.models.Identity({ provider: 'github', token: 'oldtoken' });
      identity.save(function (err) {
        account = new app.models.Account({ email: 'primary@email.com', identities: [ identity._id ]});
        account.save(function (err) {
          nock('https://github.com')
            .post('/login/oauth/access_token')
            .reply(200, "access_token=a%20fake%20token&scope=user%3Aemail&token_type=bearer");

          nock('https://api.github.com')
            .get('/user/emails?access_token=a%20fake%20token')
            .reply(200, [
              { email: 'not.primary@email.com', verified: true },
              { email: 'primary@email.com', primary: true }
            ]);

          session
            .post('/api/sessions')
            .send({
              code: 'fake',
              provider: 'github'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              app.models.Identity
                .findOne()
                .exec(function (err, identity) {
                  assert.equal(identity.token, 'a fake token');
                  helpers.session.getData(session, function (err, sessionData) {
                    assert.equal(sessionData.email, 'primary@email.com');
                    done();
                  });
                });
            });
        });
      });
    });
  });

  describe('index', function () {
    it('throws an error if the user is not logged in', function () {
      session
        .get('/api/sessions')
        .end(function (err, res) {
          assert.equal(res.status, 400);
          assert.isDefined(res.body.errors);
        });
    });

    it('returns the account if the user is logged in', function (done) {
      helpers.session.create(function (err, data) {
        session
          .get('/api/sessions')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.email, 'primary@email.com');
            done();
          });
      });
    });
  });

  describe('destroy', function () {
    it('destroys a session if a user is logged in', function (done) {
      helpers.session.create(function (err, data) {
        session
          .delete('/api/sessions/blah')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            helpers.session.getData(session, function (err, sessionData) {
              assert.isUndefined(sessionData.email);
              done();
            });
          });
      });
    });
  });
});