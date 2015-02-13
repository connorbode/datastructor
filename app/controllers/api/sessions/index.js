module.exports = function (app) {
  return {
    create: require('./create')(app),
    destroy: require('./destroy')(app),
    index: require('./index/index.js')(app)
  };
};