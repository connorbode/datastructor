describe('app.tasks.register', function () {
  it('registers successfully', function (done) {
    var provider = 'github';
    var token = 'token';
    var email = 'fake@email.com';
    app.tasks.register(provider, token, email, function (err) {
      assert.isUndefined(err);
      app.models.Account
        .find({ email: email })
        .populate('identities')
        .exec(function (err, accounts) {
          assert.equal(accounts.length, 1);
          assert.equal(accounts[0].email, email);
          assert.equal(accounts[0].identities.length, 1);
          assert.equal(accounts[0].identities[0].provider, provider);
          assert.equal(accounts[0].identities[0].token, token);
          done();
        });
    });
  });

  it('fails to register if the email already exists in the system', function (done) {
    var provider = 'github';
    var token = 'token';
    var email = 'fake@email.com';
    app.tasks.register(provider, token, email, function (err) {
      assert.isUndefined(err);
      app.tasks.register(provider, token, email, function (err) {
        assert.isDefined(err);
        assert.isDefined(err.error);
        done();
      });
    });
  });

  it('fails to register if an invalid provider is specified', function (done) {
    var provider = 'invalid';
    var token = 'token';
    var email = 'fake@email.com';
    app.tasks.register(provider, token, email, function (err) {
      assert.isDefined(err);
      assert.isDefined(err.error);
      done();
    });
  });
});