module.exports = function (app) {
  return function (req, res) {
    req.checkBody('code', 'invalid code').notEmpty();
    req.checkBody('provider', 'invalid provider').notEmpty().isProvider();
    app.tasks.checkErrors(req, res);
  };
};