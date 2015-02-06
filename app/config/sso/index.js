module.exports = function (app) {
  app.sso = {};
  app.sso.github = require('octonode');
  app.sso.github.auth.config({ id: process.env.GITHUB_CLIENT_ID, secret: process.env.GITHUB_CLIENT_SECRET });
};