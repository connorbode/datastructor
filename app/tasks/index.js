module.exports = function (app) {
  return {
    auth: require('./auth')(app),
    login: require('./login')(app),
    register: require('./register')(app)
  };
};