module.exports = function (app) {
  var Schema = app.db.Schema;
  var Identity = new Schema({
    token: String,
    type: String
  });

  Identity.schema.path('type').validate(function (value) {
    return app.sso[value];
  });

  return app.db.model('Identity', Identity);
};