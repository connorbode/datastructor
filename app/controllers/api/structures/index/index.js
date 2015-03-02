module.exports = function (req, res) {
  var email = app.controllers.getSession(req);
  var error;
  if (!email) { error = 'not logged in'; }
  app.controllers.error(error, res, function () {
    app.tasks.getStructures(email, function (err, structures) {
      app.controllers.error(error, res, function () {
        res.status(200).json(structures).end();
      });
    });
  });
};