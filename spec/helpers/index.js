module.exports = function (app) {
  return {
    session: require('./session')(app)
  };
};