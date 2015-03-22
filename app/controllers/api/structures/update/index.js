module.exports = function (req, res) {
  app.controllers.checkAuth(req, res, function () {
    app.controllers.checkParams(req, res, function () {
      var structure = req.body;
      structure._id = req.params.structure;
      app.tasks.updateStructure(structure, function (err, structure) {
        app.controllers.error(err, res, function () {
          res.status(200).json(structure).end();
        });
      });
    });
  });
};