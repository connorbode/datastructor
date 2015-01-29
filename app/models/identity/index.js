module.exports = function (app) {
  var Schema = app.db.Schema;
  var Identity = new Schema({
    token: String,
    type: { type: Number, ref: 'IdentityType' }
  });
  return app.db.model('Identity', Identity);
};