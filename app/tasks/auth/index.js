module.exports = function (app) {
  return {
    github: require('./github')(app)
  };
};