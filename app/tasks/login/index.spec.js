describe('app.tasks.login', function () {
  it('fails if the email does not exist in the system', function (done) {
    app.tasks.login('provider', 'token', 'email', function (err) {
      assert.isDefined(err);
      assert.equal(err, 'email not found');
      done();
    });
  });

  it('fails if the provider that was used to log in is not attached to the account', function (done) {
    var identity;
    var account;
    identity = new app.models.Identity({ token: 'fake', provider: 'github' });
    identity.save(function (err) {
      account = new app.models.Account({ email: 'fake@email.com', identities: [ identity._id ] });
      account.save(function (err) {
        app.tasks.login('google', 'token', 'fake@email.com', function (err) {
          assert.isDefined(err);
          assert.equal(err, 'identity not found');
          done();
        });
      });
    });
  });

  it('updates the token with the associated identity if login is successful', function (done) {
    var identity;
    var account;
    identity = new app.models.Identity({ token: 'oldtoken', provider: 'github' });
    identity.save(function (err) {
      account = new app.models.Account({ email: 'fake@email.com', identities: [ identity._id ] });
      account.save(function (err) {
        app.tasks.login('github', 'newtoken', 'fake@email.com', function (err) {
          assert.isUndefined(err);
          app.models.Account
            .findOne({ email: 'fake@email.com' })
            .populate('identities')
            .exec(function (err, account) {
              assert.equal(account.identities[0].token, 'newtoken');
              done();
            });
        });
      });
    });
  });
});