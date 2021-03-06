module.exports = function (callback) {
  var identity;
  var account;
  identity = new app.models.Identity({ provider: 'github', token: 'oldtoken' });
  identity.save(function (err) {
    account = new app.models.Account({ email: 'primary@email.com', identities: [ identity._id ]});
    account.save(function (err, account) {

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
          app.models.Identity
            .findOne()
            .exec(function (err, identity) {
              callback(null, account);
            });
        });
    });
  });
};