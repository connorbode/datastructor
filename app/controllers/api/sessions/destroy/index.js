module.exports = function (req, res) {
  app.controllers.setSession(req, undefined);
  res.status(204).end();
};