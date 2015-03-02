module.exports = function (id) {
  return new Promise(function (resolve, reject) {
    app.models.DataStructure
      .findOne({
        _id: id
      })
      .populate('operations')
      .exec(function (err, struct) {
        if (err) { return reject(err); }
        if (!struct) { return reject('structure not found'); }
        resolve(struct);
      });
  });
};