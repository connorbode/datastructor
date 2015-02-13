module.exports = function (app) {
  return {
    create: require('./create')(app),
    getData: require('./get-data')(app)
  };
};