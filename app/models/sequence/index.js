module.exports = function (app) {
  var Schema = app.db.Schema;
  var Sequence = new Schema({
    data: Schema.Types.Mixed,
    type: { type: Number, ref: 'DataStructure' }
  });
  return app.db.model('Sequence', Sequence);
};