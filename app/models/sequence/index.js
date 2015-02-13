module.exports = function () {
  var Schema = app.db.Schema;
  var Sequence = new Schema({
    data: Schema.Types.Mixed,
    operations: [ Schema.Types.Mixed ],
    type: { type: Schema.Types.ObjectId, ref: 'DataStructure' }
  });

  return app.db.model('Sequence', Sequence);
};