describe('app.tasks.addStructure', function () {
  it('adds a structure', function (done) {
    app.tasks.addStructure({ name: 'fake' }, function (err, result) {
      expect(err).to.be.a('null');
      expect(result.name).to.equal('fake');

      app.models.DataStructure
        .findOne({
          _id: result._id
        }, function (err, struct) {
          expect(struct.name).to.equal('fake');
          done();
        });
    });
  });
});