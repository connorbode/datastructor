/**
 * Test configuration
 *
 * This file is loaded before Mocha tests are run
 */

before(function (done) {
  global.assert = require('assert');
  process.env.GITHUB_CLIENT_ID = 'test';
  process.env.GITHUB_CLIENT_SECRET = 'test';
  done();
});

beforeEach(function (done) {
  global.app = {};
  require('../app/config')(global.app);
  done();
});

after(function (done) {
  global.app.db.connection.close();
  done();
});