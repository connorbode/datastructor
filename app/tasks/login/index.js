module.exports = function (provider, token, email, callback) {
  var Account = app.models.Account;
  var Identity = app.models.Identity;
  var identities;
  var identity;
  var account;
  var accountData;

  function addAccount () {
    return new Promise(function (resolve, reject) {
      Account.create({
        email: email
      }, function (err, account) {
        if (err) { return reject(err); }
        resolve(account);
      });
    });
  }

  function findAccount () {
    return new Promise(function (resolve, reject) {
      Account.findOne({
        email: email
      }).populate({
        path: 'identities',
        match: {
          provider: provider
        }
      }).exec(function (err, account) {
        if (err) { return reject(err); }
        if (!account) {
          addAccount().then(function (account) {
            resolve(account);
          }).catch(function (err) {
            reject(err);
          });
        } else {
          resolve(account);
        }
      });
    });
  }

  function addIdentity (account) {
    return new Promise(function (resolve, reject) {
      Identity.create({
        provider: provider,
        token:    token
      }, function (err, identity) {
        if (err) { return reject(err); }
        account.identities.push(identity._id);
        account.save(function (err, account) {
          if (err) { return reject(err); }
          resolve(account);
        });
      });
    });
  }

  function updateIdentity (account) {
    return new Promise(function (resolve, reject) {
      if (account.identities.length === 0) {
        addIdentity(account).then(function (account) {
          resolve(account);
        }).catch(function (err) {
          reject(err);
        });
      } else {
        account.identities[0].token = token;
        account.identities[0].save(function (err, identity) {
          if (err) { return reject(err); }
          resolve(identity);
        });
      }
    });
  }

  findAccount()
    .then(updateIdentity)
    .then(function (account) {
      callback(null, account);
    }).catch(function (err) {
      callback(err);
    });


};