module.exports = function (app) {
  return function (req, res) {
    app.controllers.setSession(req, undefined);
    res.status(200).end();
  };
};