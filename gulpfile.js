var browserify  = require('browserify');
var del         = require('del');
var minimist    = require('minimist');
var gulp        = require('gulp');
var coverage    = require('gulp-coverage');
var jshint      = require('gulp-jshint');
var mocha       = require('gulp-spawn-mocha');
var nodemon     = require('gulp-nodemon');
var stylish     = require('jshint-stylish');
var reactify    = require('reactify');
var uglify      = require('gulp-uglify');
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');

var options = minimist(process.argv.slice(2));

/**
 * Runs Mocha tests for the server
 */
gulp.task('test', function () {
  var sources = ['spec/config.js', 'app/**/*.spec.js'];

  options.reporter = 'min';
  options.istanbul = true;
  options.debugBrk = options.debug ? 'debug' : undefined;

  return gulp
    .src(sources)
    .pipe(mocha(options));
});

/** 
 * Lints the server
 */
gulp.task('lint', function () {
  var sources = ['app/**/*.js', '!app/public/**/*.js'];

  return gulp
    .src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Cleans the dist directory
 */
gulp.task('clean', function (callback) {
  del(['./dist/**/*'], callback); 
});

/**
 * Compiles the client
 */
gulp.task('browserify', function () {
  var b = browserify({ debug: true });
  var bundle;
  b.transform(reactify);
  b.add('./app/public/js/app.js');
  b.plugin('minifyify', { map: 'app.js.map', output: __dirname + '/dist/public/js/app.js.map' });

  return b.bundle()
    .pipe(source('./app/public/js/app.js'))
    .pipe(gulp.dest('./dist'));
});

/**
 * Copies the server component to the dist directory
 */
gulp.task('copy', function () {
  return gulp
    .src(['./app/**/*', '!./app/public/**/*'])
    .pipe(gulp.dest('./dist/'));
});

/**
 * Builds the application
 */
gulp.task('build', ['clean', 'copy', 'browserify']);

/**
 * Automatic server reload
 */
gulp.task('develop', function () {
  nodemon({
    script: './dist/index.js',
    ext: 'js',
    ignore: ['./dist/**/*', './app/public/**/*']
  }).on('change', ['lint', 'copy']);
});