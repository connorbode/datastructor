describe('app.controllers.api.accounts.create', function () {
  it('returns 400 if a code is not supplied', function (done) {
    session
      .post('/api/accounts')
      .send({
        provider: 'github'
      })
      .expect(400)
      .end(function (err, res) {
        done();
      });
  });

  it('returns 400 if an oauth provider is not supplied', function (done) {
    session
      .post('/api/accounts')
      .send({
        code: 'fake'
      })
      .expect(400)
      .end(function (err, res) {
        done();
      });
  });

  it('returns 400 if an invalid oauth provider is supplied', function (done) {
    session
      .post('/api/accounts')
      .send({
        code: 'fake',
        provider: 'invalid'
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
      .post('/api/accounts')
      .send({
        code: 'fake',
        provider: 'github'
      })
      .expect(400)
      .end(function (err, res) {
        done();
      });
  });

  it('returns 201 and creates an account', function (done) {
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
      .post('/api/accounts')
      .send({
        code: 'fake',
        provider: 'github'
      })
      .expect(201)
      .end(function (err, res) {
        app.models.Account
          .find({ email: 'primary@email.com' })
          .populate('identities')
          .exec(function (err, accounts) {
            assert.equal(accounts.length, 1);
            assert.equal(accounts[0].email, 'primary@email.com');
            assert.equal(accounts[0].identities.length, 1);
            assert.equal(accounts[0].identities[0].provider, 'github');
            assert.equal(accounts[0].identities[0].token, 'a fake token');
            done();
          });
      });
  });


  it('returns 400 if oauth email is already part of an account', function (done) {
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
      .post('/api/accounts')
      .send({
        code: 'fake',
        provider: 'github'
      })
      .expect(201)
      .end(function (err, res) {

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
          .post('/api/accounts')
          .send({
            code: 'fake',
            provider: 'github'
          })
          .expect(400)
          .end(function (err, res) {
            assert.equal(res.body.errors[0].error, 'email exists in system');
            done();
          });
      });
  }); 

  // it('returns 400 if the user is logged in', function (done) {
  //   session
  //     .post('/api/accounts')
  //     .send({
  //       code: 'fake',
  //       provider: 'github'
  //     })
  //     .expect(400)
  //     .end;
  // });
});