module.exports = function (req, value) {
  req.session.email = value;
};