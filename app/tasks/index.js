module.exports = function (app) {
  return {
    error: require('./error')(app),
    login: require('./login')(app)
  };
};