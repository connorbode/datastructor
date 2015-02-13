module.exports = function () {
  var Schema = app.db.Schema;
  var DataStructure = new Schema({
    name: String,
    validation: Schema.Types.Mixed,
    operations: [{ type: Schema.Types.ObjectId, ref: 'Operation' }]
  });
  return app.db.model('DataStructure', DataStructure);
};