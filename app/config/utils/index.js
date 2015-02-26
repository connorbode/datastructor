var JaySchema = require('jayschema');

global._ = require('lodash');

module.exports = function () {
  app.utils = {
    schema: new JaySchema()
  };
};