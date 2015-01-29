module.exports = function (app) {
  var Schema = app.db.Schema;
  var Operation = new Schema({
    validation: Schema.Types.Mixed
  });
  return app.db.model('Operation', Operation);
};