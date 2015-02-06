module.exports = function (app) {
  require('./routing')(app);
  require('./db')(app);
  require('./sso')(app);
};