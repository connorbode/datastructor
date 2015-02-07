module.exports = function (app) {
  return function (req, res) {

    // validate the request parameters 
    req.checkBody('code', 'invalid code').notEmpty();
    req.checkBody('provider', 'invalid provider').notEmpty().isProvider();
    app.controllers.checkParams(req, res);

    // authenticate with the provider supplied
    app.tasks.auth[req.body.provider](req.body.code, function (err, token, email) {
      app.controllers.error(err, res);
      app.tasks.login(req.body.provider, token, email, function (err) {
        app.controllers.error(err, res);
      });
    });
  };
};