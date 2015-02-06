module.exports = function (app) {
  var Schema = app.db.Schema;
  var Identity = new Schema({
    token: String,
    type: String
  });

  var IdentityModel = app.db.model('Identity', Identity);

  IdentityModel.schema.path('type').validate(function (value) {
    return app.sso[value] === undefined ? false : true;
  });

  return IdentityModel;
};