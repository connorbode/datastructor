module.exports = function (req, res, callback) {
  var errors = req.validationErrors(true);
  if (errors) {
    res.status(400).send({ errors: errors });
    return;
  }
  callback();
};