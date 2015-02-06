describe('app.models.identity', function () {

  it('allows identities to be created using enabled sso providers', function (done) {
    var providers = _.keys(app.sso);
    _.forEach(providers, function (value, index) {
      app.models.Identity.create({token: 'test', provider: value}, function (err, identity) {
        assert.isNull(err);
        if (index === providers.length - 1) {
          done();
        }
      });
    });
  });

  it('does not allow identities to be created using non-enabled sso providers', function (done) {
    app.models.Identity.create({token: 'test', provider: 'google'}, function (err, identity) {
      assert.isNotNull(err);
      done();
    });
  });
});