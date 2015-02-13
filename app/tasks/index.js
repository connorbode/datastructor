module.exports = function (app) {
  return {
    auth: require('./auth')(app),
    getAccount: require('./get-account')(app),
    login: require('./login')(app),
    register: require('./register')(app)
  };
};