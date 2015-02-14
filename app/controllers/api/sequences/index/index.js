module.exports = function (req, res) {

  // verify the user is logged in
  app.controllers.checkAuth(req, res, function () {

    // check limit & offset
    app.controllers.setListVars(req, function (vars) {

      // get sequences
      app.tasks.listSequences(vars, function (err, sequences) {
        app.controllers.error(err, res, function () {
          res.status(200).json(sequences).end();
        });
      });
    });
  });
};  