var gulp = require('gulp');
var mocha = require('gulp-mocha');

var options = {
  mocha: {
    reporter: 'nyan'
  }
};

var sources = {
  mocha: ['spec/config.js', 'app/**/*.spec.js']
};

gulp.task('test', function () {
  return gulp
    .src(sources.mocha)
    .pipe(mocha(options.mocha));
});