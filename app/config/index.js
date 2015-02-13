module.exports = function () {
  require('./routing')();
  require('./db')();
  require('./sso')();
};