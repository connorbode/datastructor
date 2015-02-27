describe('app.tasks.login', function () {
  it('creates an account and adds the provider if the email is not in the system', function (done) {
    app.tasks.login('github', 'token', 'email', function (err) {
      app.models.Account
        .findOne({
          email: 'email'
        })
        .populate('identities').exec(function (err, account) {
          assert.isNull(err);
          assert.isNotNull(account);
          assert.equal(account.email, 'email');
          assert.equal(account.identities.length, 1);
          assert.equal(account.identities[0].provider, 'github');
          assert.equal(account.identities[0].token, 'token');
          done();
        });
    });
  });

  it('updates the token if the provider does exist in the system', function (done) {
    new Promise(function (resolve, reject) {
      app.models.Identity
        .create({
          provider: 'github',
          token:    'oldtoken'
        }, function (err, identity) {
          if (err) { reject(err); }
          resolve(identity);
        });
    }).then(function (identity) {
      return new Promise(function (resolve, reject) {
        app.models.Account
          .create({
            email:      'email',
            identities: [ identity._id ] 
          }, function (err, account) {
            if (err) { reject(err); }
            resolve(account);
          });
      });
    }).then(function (account) {
      app.tasks.login('github', 'token', 'email', function (err) {
        app.models.Account
          .findOne({
            email: 'email'
          })
          .populate('identities').exec(function (err, account) {
            assert.isNull(err);
            assert.isNotNull(account);
            assert.equal(account.email, 'email');
            assert.equal(account.identities.length, 1);
            assert.equal(account.identities[0].provider, 'github');
            assert.equal(account.identities[0].token, 'token');
            done();
          });
      });
    });
  });
});