module.exports = function (app) {
  return {
    auth: require('./auth')(app),
    checkErrors: require('./check-errors')(app)
  };
};