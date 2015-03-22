module.exports = function () {
  var Schema = app.db.Schema;
  var Operation = new Schema({
    name:       String,
    validation: Schema.Types.Mixed,
    operation:  String
  });
  return app.db.model('Operation', Operation);
};