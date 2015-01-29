module.exports = function (app) {
  var Schema = app.db.Schema;
  var IdentityType = new Schema({
    name: String
  });
  return app.db.model('IdentityType', IdentityType);
};