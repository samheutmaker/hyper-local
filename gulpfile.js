'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  gulp.src('./www/stylesheets/scss/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./www/stylesheets/css'));
});
 
gulp.task('default', function () {
  gulp.watch('./www/stylesheets/scss/*.scss', ['sass']);
});