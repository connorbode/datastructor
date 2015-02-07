module.exports = function (app) {
  return function (req) {
    return req.session.email;
  };
};