module.exports = function (err, res, callback) {
  if (err) {
    if (err.message) {
      err = err.message;
    }
    res.status(400).json({ errors: [ err ] });
    return;
  }
  callback();
};