var gulp = require('gulp');
var mocha = require('gulp-mocha');
var coverage = require('gulp-coverage');

var options = {
  mocha: {
    reporter: 'min'
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