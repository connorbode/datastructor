module.exports = function () {
  var Schema = app.db.Schema;
  var Sequence = new Schema({
    name: String,
    data: Schema.Types.Mixed,
    operations: [ Schema.Types.Mixed ],
    type: { type: Schema.Types.ObjectId, ref: 'DataStructure' },
    owner: { type: Schema.Types.ObjectId, ref: 'Account' }
  });

  return app.db.model('Sequence', Sequence);
};