var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/datastructor');

var cat = mongoose.Schema({ 
  name: String 
});

module.exports = {
  cat: mongoose.model('cat', cat)
};