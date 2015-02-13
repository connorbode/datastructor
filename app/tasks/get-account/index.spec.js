describe('app.tasks.get-account', function () {
  
  var accountId;

  beforeEach(function (done) {
    app.models.Account
      .create({
        email: 'hi',
        name: 'hi'
      }, function (err, acc) {
        accountId = acc._id;
        done();
      });
  });

  it('passes an error if the account is not found', function (done) {
    app.tasks.getAccount('fake', function (err, account) {
      assert.isNotNull(err);
      done();
    });
  });

  it('returns the account if found', function (done) {
    app.tasks.getAccount('hi', function (err, account) {
      assert.isNull(err);
      assert.isNotNull(account);
      done();
    });
  });
});