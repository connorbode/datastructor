module.exports = function (app) {
  return function (req, res) {
    var errors = req.validationErrors(true);
    if (errors) {
      res.status(400).send({ errors: errors });
      return;
    }
  };
};