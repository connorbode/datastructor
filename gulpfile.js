var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
  return gulp
    .src('app/**/*.spec.js')
    .pipe(mocha({reporter: 'nyan'}));
});