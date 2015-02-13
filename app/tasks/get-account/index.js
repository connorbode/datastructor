module.exports = function (app) {
  return function (email, callback) {
    app.models.Account
      .findOne({
        email: email
      })
      .lean()
      .exec(function (err, account) {
        return callback(err, account);
      });
  };
};