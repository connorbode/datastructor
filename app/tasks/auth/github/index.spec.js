describe('app.tasks.auth.github', function () {
  var GithubAuthTask;

  beforeEach(function (done) {
    GithubAuthTask = require('./index.js')(app);
    done();
  });

  it('handles successful auth with github', function (done) {
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, "access_token=a%20fake%20token&scope=user%3Aemail&token_type=bearer");

    nock('https://api.github.com')
      .get('/user/emails')
      .reply(200, [
        { email: 'not.primary@email.com', verified: true },
        { email: 'primary@email.com', primary: true }
      ]);

    GithubAuthTask('hi', function (err, token, email) {
      assert.equal(token, 'a fake token');
      assert.equal(email, 'primary@email.com');
      assert.isNull(err);
      done();
    });
  });

  it('handles failed auth with github', function (done) {
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(404);

    GithubAuthTask('hi', function (err, token, email) {
      assert.isNotNull(err);
      assert.isDefined(err.error);
      done();
    });
  });

  it('handles failed request for email with github', function (done) {
    nock('https://github.com')
      .post('/login/oauth/access_token')
      .reply(200, "access_token=a%20fake%20token&scope=user%3Aemail&token_type=bearer");

    nock('https://api.github.com')
      .get('/user/emails')
      .reply(404);

    GithubAuthTask('hi', function (err, token, email) {
      assert.isDefined(err.error);
      done();
    });
  });
});