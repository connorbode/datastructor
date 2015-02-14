module.exports = function (req, res) {

  // verify the user is logged in
  app.controllers.checkAuth(req, res, function () {

    // retrieve the resource if it exists
    app.tasks.getSequence(req.params.sequence, function (err, sequence) {
      app.controllers.error(err, res, function () {
        res.status(200).json(sequence).end();
      });
    });
  });
};