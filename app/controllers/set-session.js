module.exports = function (app) {
  return function (req, value) {
    req.session.email = value;
  };
};