describe('app.controllers.api.sessions.create', function () {
  it('should fail if there is no code sent', function (done) {
    session
      .post('/api/sessions')
      .send({
        provider: 'fake'
      })
      .expect(400)
      .end(function (err, res) {
        done();
      });
  });

  it('should fail if there is no provider sent', function (done) {
    session
      .post('/api/sessions')
      .send({
        code: 'fake'
      })
      .expect(400)
      .end(function (err, res) {
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
      .expect(400)
      .end(function (err, res) {
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
      .expect(400)
      .end(function (err, res) {
        done();
      });
  });

  it('returns 400 if the email is not found', function (done) {
    var identity;
    var account;
    identity = new app.models.Identity({ provider: 'github', token: 'oldtoken' });
    identity.save(function (err) {
      account = new app.models.Account({ email: 'other@email.com', identities: [ identity._id ]});
      account.save(function (err) {
        nock('https://github.com')
          .post('/login/oauth/access_token')
          .reply(200, "access_token=a%20fake%20token&scope=user%3Aemail&token_type=bearer");

        nock('https://api.github.com')
          .get('/user/emails')
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
          .expect(400)
          .end(function (err, res) {
            done();
          });
      });
    });
  });

  it('successfully logs a user in', function (done) {
    var identity;
    var account;
    identity = new app.models.Identity({ provider: 'github', token: 'oldtoken' });
    identity.save(function (err) {
      account = new app.models.Account({ email: 'primary@email.com', identities: [ identity._id ]});
      account.save(function (err) {
        nock('https://github.com')
          .post('/login/oauth/access_token')
          .reply(200, "access_token=a%20fake%20token&scope=user%3Aemail&token_type=bearer");

        nock('https://api.github.com')
          .get('/user/emails')
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
          .expect(200)
          .end(function (err, res) {
            app.models.Identity
              .findOne()
              .exec(function (err, identity) {
                assert.equal(identity.token, 'a fake token');
                done();
              });
          });
      });
    });
  });
});