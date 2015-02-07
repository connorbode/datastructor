module.exports = function (app) {
  return function (req, res, callback) {
    var errors = req.validationErrors(true);
    if (errors) {
      res.status(400).send({ errors: errors });
      return;
    }
    callback();
  };
};