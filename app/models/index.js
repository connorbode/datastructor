module.exports = function (app) {
  return {
    Account: require('./account')(app),
    DataStructure: require('./data-structure')(app),
    Identity: require('./identity')(app),
    Operation: require('./operation')(app),
    Sequence: require('./sequence')(app),
  };
};