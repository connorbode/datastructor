var gulp = require('gulp');
var mocha = require('gulp-spawn-mocha');
var coverage = require('gulp-coverage');
var minimist = require('minimist');

var options = minimist(process.argv.slice(2));

gulp.task('test', function () {
  options.reporter = 'min';
  options.istanbul = true;
  options.debugBrk = options.debug ? 'debug' : undefined;

  var sources = ['spec/config.js', 'app/**/*.spec.js'];

  return gulp
    .src(sources)
    .pipe(mocha(options));
});