/**
 * Test configuration
 *
 * This file is loaded before Mocha tests are run
 */

var mockgoose = require('mockgoose');

before(function (done) {
  process.env.GITHUB_CLIENT_ID = 'test';
  process.env.GITHUB_CLIENT_SECRET = 'test';

  global.app = {};
  require('../app/config')(app);
  mockgoose(app.db);
  app.tasks = require('../app/tasks')(app);
  app.controllers = require('../app/controllers')(app);
  app.models = require('../app/models')(app);
  done();
});

before(function (done) {
  global.chai = require('chai');
  global.assert = chai.assert;
  global.expect = chai.expect;
  global.should = chai.should();
  global.supertest = require('supertest');
  global.nock = require('nock');
  global._ = require('lodash');
  done();
});

beforeEach(function (done) {
  mockgoose.reset();
  done();
});

after(function (done) {
  app.db.connection.close();
  done();
});