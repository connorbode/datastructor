var browserify  = require('browserify');
var del         = require('del');
var minimist    = require('minimist');
var gulp        = require('gulp');
var coverage    = require('gulp-coverage');
var jshint      = require('gulp-jshint');
var mocha       = require('gulp-spawn-mocha');
var stylish     = require('jshint-stylish');
var reactify    = require('reactify');
var uglify      = require('gulp-uglify');
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');

var options = minimist(process.argv.slice(2));

gulp.task('test', function () {
  var sources = ['spec/config.js', 'app/**/*.spec.js'];

  options.reporter = 'min';
  options.istanbul = true;
  options.debugBrk = options.debug ? 'debug' : undefined;

  return gulp
    .src(sources)
    .pipe(mocha(options));
});

gulp.task('jshint', function () {
  var sources = ['app/**/*.js', '!app/public/bower_components/**/*.js'];

  return gulp
    .src(sources)
    .transform(reactify)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function (callback) {
  del(['./dist/**/*'], callback); 
});

gulp.task('build', ['clean'], function () {
  var b = browserify({ debug: true });
  var bundle;
  b.transform(reactify);
  b.add('./app/public/js/app.js');
  b.plugin('minifyify', { map: 'app.js.map', output: __dirname + '/dist/public/js/app.js.map' });

  return b.bundle()
    .pipe(source('./app/public/js/app.js'))
    .pipe(gulp.dest('./dist/public/js/app.js'));
});