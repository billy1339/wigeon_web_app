var gulp = require('gulp'),
notify = require("gulp-notify")
bower = require('gulp-bower');
concat = require('gulp-concat');
cssmin = require('gulp-clean-css');
rename = require("gulp-rename");
sass = require('gulp-sass');
uglify = require('gulp-uglify');
build = require('gulp-build');
bowerSrc = require('gulp-bower-src');
gulpFilter = require('gulp-filter');
del = require('del');

// var config = {
//     sassPath: './sass',
//     bowerDir: './bower_components'
// }

//scripts task
gulp.task('scripts', function() {
  return gulp.src(['./scripts/*.js', './scripts/controllers/*.js', './scripts/directives/*.js', './scripts/factories/*.js', './scripts/filters/*.js'])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/scripts/'));
});

// styles task
gulp.task('styles', function() {
  return gulp.src('./sass/*.scss')
    .pipe(concat('style.css'))
    .pipe(sass())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css/'));
});

//watch task
gulp.task('watch', function() {
  gulp.watch('./scripts/**/*.js', ['scripts']);
  gulp.watch('./sass/*.scss', ['styles']);
  gulp.watch('./templates/**/*.html', ['html']);
});

// clean task
gulp.task('clean', function (cb) {
    del(['dist/**/*', '!dist/robots.txt', '!dist/index.html', '!dist/sitemap.xml', '!dist/termsofservice.pdf','!dist/privacypolicy.pdf']);
});

// bower task
gulp.task('bower', function () {
  return gulp.src(['bower_components/angular/angular.min.js','bower_components/angular/angular.min.js.map', 'bower_components/angular-route/angular-route.min.js','bower_components/angular/angular.min.js.map', 'bower_components/angular-route/angular-route.min.js.map', 'bower_components/jquery/dist/jquery.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'bower_components/bootstrap/dist/css/bootstrap.min.css'])
    .pipe(gulp.dest('./dist/vendor/'))
});

//images task
gulp.task('images', function () {
  return gulp.src(['images/**/*'])
    .pipe(gulp.dest('./dist/assets/images'))
});

//html task
gulp.task('html', function () {
  return gulp.src(['views/**/*'])
    .pipe(gulp.dest('./dist/views/'))
});


gulp.task('default', ['html', 'images','bower', 'styles', 'scripts', 'watch'])
