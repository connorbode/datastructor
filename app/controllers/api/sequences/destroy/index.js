module.exports = function (req, res) {
  var email;
  app.controllers.checkAuth(req, res, function () {
    email = app.controllers.getSession(req);
    app.tasks.getAccount(email, function (err, account) {
      app.tasks.deleteSequence(req.params.sequence, account._id, function (err) {
        app.controllers.error(err, res, function () {
          res.status(204).end();
        });
      });
    });
  });
};