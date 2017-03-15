var gulp = require('gulp');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");

gulp.task('webpack', function () {
  return gulp.src('src/')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename("index.js"))
    .pipe(gulp.dest('build/'));
});

gulp.task('sass', function () {
  gulp.src('src/*.scss')
    .pipe(sass({ outputStyle: 'compressed' })
      .on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/'));
});

gulp.task('build', ['webpack', 'sass']);
