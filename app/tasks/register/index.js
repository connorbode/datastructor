module.exports = function (app) {
  return function (provider, token, email, callback) {
    var Account = app.models.Account;
    var Identity = app.models.Identity;
    var identity;
    var account;
    Account
      .find({ email: email })
      .exec(function (err, accounts) {
        if (err) {
          callback({ error: err });
          return; 
        }

        if (accounts.length > 0) {
          callback({ error: 'email exists in system' });
          return;
        }

        identity = new Identity({ provider: provider, token: token });
        identity.save(function (err) {
          if (err) {
            callback({ error: err });
            return;
          }

          account = new Account({ email: email, identities: [ identity._id ] });
          account.save(function (err) {
            if (err) {
              callback({ error: err });
              return;
            }

            callback();
          });
        });
      });  
  };
};