module.exports = function (email, callback) {
  app.models.Account
    .findOne({
      email: email
    })
    .lean()
    .exec(function (err, account) {
      return callback(err, account);
    });
};