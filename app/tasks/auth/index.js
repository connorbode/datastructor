/**
 * All auth modules provide the following function:
 * 
 * f(code, callback)
 *
 * where f can be called as:
 *
 * f(code, function (err, token, email) { });
 *
 * - token is the access token for the provider
 * - email is the main email from the account
 */

module.exports = {
  github: require('./github')
};