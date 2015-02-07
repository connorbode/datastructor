module.exports = function (app) {
  return function (req, res) {
    // validate the request parameters 
    req.checkBody('code', 'invalid code').notEmpty();
    req.checkBody('provider', 'invalid provider').notEmpty().isProvider();
    app.controllers.checkParams(req, res, function () {

      // authenticate with the provider supplied
      app.tasks.auth[req.body.provider](req.body.code, function (err, token, email) {
        app.controllers.error(err, res, function () {
          app.tasks.register(req.body.provider, token, email, function (err) {
            app.controllers.error(err, res, function () {
              res.status(201).end();
            });
          });
        });
      });
    });
  };
};