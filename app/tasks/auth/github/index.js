module.exports = function (code, callback) {
  var github = app.sso.github;
  var email;
  github.auth.login(code, function (err, token) {
    if (err) {
      callback(err);
      return;
    }

    github.client(token).me().emails(function (err, data, headers) {
      if (err) {
        callback(err);
        return;
      }

      email = _.where(data, { primary: true})[0].email;
      callback(err, token, email);
      return;
    });
  });
};