module.exports = function (params) {
  var app = params.app;
  var model = params.model;
  var validator = params.validator;

  app.get('/cats', function (req, res) {
    model.cat.find(function (err, cats) {
      if (err) {
        res.json(err);
      } else {
        res.json(cats);
      }
    });
  });

  app.post('/cats', function (req, res) {
    req
      .checkBody('name', 'invalid name')
      .notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.json({ errors: errors });
    }

    var cat = new model.cat({ name: req.body.name });
    cat.save(function (err, cat) {
      res.json(cat);
    });
  });
};