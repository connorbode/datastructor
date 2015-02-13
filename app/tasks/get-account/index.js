module.exports = function (email, callback) {
  app.models.Account
    .findOne({
      email: email
    })
    .lean()
    .exec(function (err, account) {
      if (!account) { return callback('account not found'); }
      return callback(err, account);
    });
};