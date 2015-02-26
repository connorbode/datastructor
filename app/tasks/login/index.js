module.exports = function (provider, token, email, callback) {
  var Account = app.models.Account;
  var Identity = app.models.Identity;
  var identities;
  var identity;
  var account;
  var accountData;
  Account
    .findAndModify({ 
      query: {
        email: email
      },
      new: true,
      upsert: true
    })
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

      if (account.identities.length === 0) {
        Identity.create({
          token: token,
          provider: provider
        }).exec(function (err, identity) {

        });
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