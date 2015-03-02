module.exports = function (req, res) {
  app.controllers.checkAuth(req, res, function () {
    app.controllers.checkParams(req, res, function () {
      app.tasks.getStructure(req.params.structure)
        .then(function (struct) {
          res.status(200).json(struct).end();
        })
        .catch(function (err) {
          app.controllers.error(err, res);
        });
    });
  });
};