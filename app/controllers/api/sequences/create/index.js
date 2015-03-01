module.exports = function (req, res) {

  var email;
  
  // validate user is logged in
  app.controllers.checkAuth(req, res, function () {

    // validate request parameters
    req.checkBody('name', 'invalid name').notEmpty();
    req.checkBody('type', 'must provide a type').notEmpty();
    app.controllers.checkParams(req, res, function () {

      // add the sequence
      email = app.controllers.getSession(req);
      app.tasks.getAccount(email, function (err, account) {
        app.controllers.error(err, res, function () {
          req.body.owner = account._id;
          app.tasks.addSequence(req.body, function (err, data) {
            app.controllers.error(err, res, function () {
              res.status(201).json(data).end();
            });
          });
        });
      });
    });
  });
};