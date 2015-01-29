var express = require('express');
var app = express();

app.get('*', function (req, res) {
  res.send('hi! welcome to a webapp');
});

app.listen(3000);