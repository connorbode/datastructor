module.exports = function (app) {
  var Schema = app.db.Schema;
  var Identity = new Schema({
    token: String,
    provider: String
  });

  var IdentityModel = app.db.model('Identity', Identity);

  IdentityModel.schema.path('provider').validate(function (value) {
    return app.sso[value] === undefined ? false : true;
  });

  return IdentityModel;
};