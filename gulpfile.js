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
var runSequence = require('run-sequence');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');
var watch       = require('gulp-watch');

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
gulp.task('lint-client', function (done) {
  return gulp
    .src(['app/public/**/*.js'])
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe(jshint.reporter('fail'))
    .pipe(done);
});

/**
 * Cleans the dist directory
 */
gulp.task('clean', function (callback) {
  del(['./dist/**/*'], callback); 
});

/**
 * Compiles the client javascript
 */
gulp.task('browserify', function () {
  var b = browserify({ debug: true });
  b.transform(reactify);
  b.add('./app/public/app.js');
  b.plugin('minifyify', { map: 'app.js.map', output: __dirname + '/dist/public/app.js.map' });

  return b.bundle()
    .on('error', function (err) {
      console.log(err.message);
    })
    .pipe(source('public/app.js'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Copies the server component to the dist directory
 */
gulp.task('copy-server', function () {
  return gulp
    .src(['./app/**/*', '!./app/public/**/*'])
    .pipe(gulp.dest('./dist/'));
});

/**
 * Copies the client component to the dist directory
 */
gulp.task('copy-client', function () {
  return gulp
    .src(['./app/public/index.html'])
    .pipe(gulp.dest('./dist/public/'));
});

/**
 * Compiles the client SASS
 */
gulp.task('sass', function () {
  return gulp
    .src(['./app/public/main.scss'])
    .pipe(sass({
      outputStyle: 'compress',
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./dist/public/'));
});

/**
 * Copies client assets
 */
gulp.task('assets', function () {
  return gulp
    .src(['./app/public/assets/**/*'])
    .pipe(gulp.dest('./dist/public/assets/'));
});

/**
 * Builds the application
 */
gulp.task('build', function (done) {
  runSequence('clean', 'copy-server', 'browserify', 'copy-client', 'sass', 'assets', done);
});

/**
 * Automatic server reload
 */
gulp.task('nodemon', ['build'], function (done) {
  var called = false;
  return nodemon({
    script: './dist/index.js',
    ext: 'js',
    ignore: ['dist/**/*', 'app/public/**/*']
  }).on('change', ['lint-server', 'copy-server'])
    .on('start', ['watch']);
});

/**
 * Development task
 */
gulp.task('watch', function () {
  gulp.watch(['app/public/**/*.js'], ['browserify']);
  gulp.watch(['app/public/index.html'], ['copy-client']);
  gulp.watch(['app/public/**/*.scss'], ['sass']);
});

/**
 * Default
 */
gulp.task('default', ['nodemon']);