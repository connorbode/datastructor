module.exports = function (req, res) {
  var email = app.controllers.getSession(req);
  var error;
  if (!email) { error = 'not logged in'; }
  app.controllers.error(error, res, function () {
    app.tasks.getAccount(email, function (err, account) {
      app.controllers.error(error, res, function () {
        res.status(200).json(account).end();
      });
    });
  });
};