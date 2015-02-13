module.exports = function () {
  var Schema = app.db.Schema;
  var Account = new Schema({
    email: String,
    name: String,
    sequences: [{ type: Number, ref: 'Sequence' }],
    identities: [{ type: Schema.Types.ObjectId, ref: 'Identity' }]
  });
  return app.db.model('Account', Account);
};