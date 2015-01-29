module.exports = function (app) {
  var Schema = app.db.Schema;
  var Account = new Schema({
    email: String,
    name: String,
    sequences: [{ type: Number, ref: 'Sequence' }],
    identities: [{ type: Number, ref: 'Identity' }]
  });
  return app.db.model('Account', Account);
};