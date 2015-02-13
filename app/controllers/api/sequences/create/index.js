module.exports = function (req, res) {
  
  // validate user is logged in
  app.controllers.checkAuth(req, res, function () {

    // validate request parameters
    req.checkBody('name', 'invalid name').notEmpty();
    req.checkBody('data', 'must provide data').notEmpty();
    req.checkBody('operations', 'must provide operations').notEmpty();
    req.checkBody('type', 'must provide a type').notEmpty();
    app.controllers.checkParams(req, res, function () {

      // add the sequence
      app.tasks.addSequence(req.body, function (err, data) {
        app.controllers.error(err, res, function () {
          res.status(201).json(data).end();
        });
      });
    });
  });
};