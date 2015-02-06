/**
 * Test configuration
 *
 * This file is loaded before Mocha tests are run
 */

before(function (done) {
  global.chai = require('chai');
  global.assert = chai.assert;
  global.expect = chai.expect;
  global.should = chai.should();
  global._ = require('lodash');
  process.env.GITHUB_CLIENT_ID = 'test';
  process.env.GITHUB_CLIENT_SECRET = 'test';
  done();
});

beforeEach(function (done) {
  global.app = {};
  require('../app/config')(global.app);
  done();
});

afterEach(function (done) {
  global.app.db.connection.close(function () {
    app.db.models = {};
    app.db.modelSchemas = {};
    done();
  });
});