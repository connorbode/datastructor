module.exports = function (app) {
  return {
    login: require('./login')(app)
  };
};