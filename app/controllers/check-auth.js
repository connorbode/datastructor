module.exports = function (req, res, callback) {
  if (!req.session.email) {
    res.status(400).json({ errors: [ 'not logged in' ] });
    return;
  }
  callback();
};