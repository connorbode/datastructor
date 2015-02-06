module.exports = function (app) {
  return function (req, res) {

    // validate the request parameters 
    req.checkBody('code', 'invalid code').notEmpty();
    req.checkBody('provider', 'invalid provider').notEmpty().isProvider();
    app.controllers.checkParams(req, res);

    // authenticate with the provider supplied
    app.tasks.auth[req.body.provider](req.body.code, function (err, token) {
      app.controllers.error(err, res);
      app.tasks.login({ token: token, provider: req.body.provider }, function (err) {
        app.controllers.error(err, res);
      });
    });
  };
};