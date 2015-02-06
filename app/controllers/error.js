module.exports = function (app) {
  return function (err, res) {
    if (err) {
      res.status(400).send({ errors: err });
      return;
    }
  };
};