module.exports = function (req, res) {

  // validate user is logged in
  app.controllers.checkAuth(req, res, function () {

    // check parameters 
    req.checkBody('name', 'invalid name').notEmpty();
    app.controllers.checkParams(req, res, function () {

      // add the data structure
      app.tasks.addStructure({ name: req.body.name }, function (err, result) {
        res.status(201).json(result).end();
      });
    });
  });
};