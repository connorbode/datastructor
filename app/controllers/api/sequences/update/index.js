module.exports = function (req, res) {
  var email;
  app.controllers.checkAuth(req, res, function () {
    email = app.controllers.getSession(req);
    app.tasks.getAccount(email, function (err, account) {
      app.controllers.error(err, res, function () {
        app.tasks.updateSequence(req.params.sequence, account._id, req.body, function (err, sequence) {
          app.controllers.error(err, res, function () {
            res.status(200).json(sequence).end();
          });
        });
      });
    });
  });
};