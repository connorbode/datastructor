module.exports = function () {
  require('./routing')();
  require('./db')();
  require('./sso')();
  require('./utils')();
};