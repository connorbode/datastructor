module.exports = function (app) {
  var Schema = app.db.Schema;
  var DataStructure = new Schema({
    validation: Schema.Types.Mixed,
    operations: [{ type: Number, ref: 'Operation' }]
  });
  return app.db.model('DataStructure', DataStructure);
};