module.exports = function (app) {
  return function (provider, token, email, callback) {
    var Account = app.models.Account;
    var Identity = app.models.Identity;
    var identities;
    var identity;
    var account;
    var accountData;
    Account
      .findOne({ email: email })
      .populate({
        path: 'identities',
        model: 'Identity',
        match: {
          provider: provider
        }
      })
      .exec(function (err, account) {
        if (err) {
          callback(err);
          return;
        }

        if (!account) {
          callback('email not found');
          return;
        }

        if (account.identities.length === 0) {
          callback('identity not found');
          return;
        }

        account.identities[0].token = token;
        account.identities[0].save(function (err) {
          if (err) {
            callback(err);
            return;
          }

          callback();
        });
      });
  };
};