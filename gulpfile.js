var browserify  = require('browserify');
var del         = require('del');
var minimist    = require('minimist');
var gulp        = require('gulp');
var coverage    = require('gulp-coverage');
var jshint      = require('gulp-jshint');
var jsxhint     = require('gulp-jsxhint');
var map         = require('map-stream');
var mocha       = require('gulp-spawn-mocha');
var nodemon     = require('gulp-nodemon');
var stylish     = require('jshint-stylish');
var reactify    = require('reactify');
var react       = require('gulp-react');
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
gulp.task('lint-server', function () {
  var sources = ['app/**/*.js', '!app/public/**/*.js'];

  return gulp
    .src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Lints the client
 */
gulp.task('lint-client', function () {
  return gulp
    .src(['app/public/**/*.js'])
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe(jshint.reporter('fail'));
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
  b.transform(reactify);
  b.add('./app/public/app.js');
  b.plugin('minifyify', { map: 'app.js.map', output: __dirname + '/dist/public/app.js.map' });

  return b.bundle()
    .pipe(source('public/app.js'))
    .pipe(gulp.dest('./dist/'));
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
gulp.task('nodemon', function (done) {
  var called = false;
  nodemon({
    script: './dist/index.js',
    ext: 'js',
    ignore: ['./dist/**/*', './app/public/**/*']
  }).on('change', ['lint-server', 'copy']);
});

/**
 * Development task
 */
gulp.task('develop', ['nodemon'], function () {
  gulp.watch(['./app/public/**/*.js'], ['lint-client', 'browserify']);
});