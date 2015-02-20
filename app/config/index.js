module.exports = function () {

  // check that the appropriate environment  variables have been set
  var env = [
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET'
  ];

  var unset = "";

  env.forEach(function (e) {
    if (!process.env[e]) {
      unset += e + ", ";
    }
  });

  if (unset) {
    unset = unset.trim(/, $/, "");
    throw "The following environment variables must be set: " + unset;
  }

  require('./routing')();
  require('./db')();
  require('./sso')();
  require('./utils')();
};