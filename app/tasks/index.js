module.exports = function (app) {
  return {
    login: require('./login')(app),
    register: require('./register')(app)
  };
};