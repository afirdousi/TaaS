'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
//var gulpIf = require('gulp-if');
//var gulpRev = require('gulp-rev');
var autoPrefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');

gulp.task('build-css', function() {

    return gulp.src([
            'scss/made-application.scss',
            'scss/made-application-plugins.scss',
            'scss/made-application-skins.scss'
        ])
        .pipe(sass({
            includePaths: ['./scss'],
            outputStyle: buildOptions.release ? 'compressed' : 'nested',
            errLogToConsole: true
        }))
        .pipe(sourcemaps.init())
        .pipe(autoPrefixer())
        //.pipe(gulpIf(buildOptions.release, gulpRev()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/styles/css'));
});

gulp.task('build-api-css', function() {

    return gulp.src('src/api-docs/api.scss')
        .pipe(sass({
            includePaths: [],
            outputStyle: buildOptions.release ? 'compressed' : 'nested',
            errLogToConsole: true
        }))
        .pipe(gulp.dest('src/api-docs'));
});

gulp.task('watch-css', function() {
    gulp
        .watch('scss/**/*.scss', ['build-css'])
        .on('change', function(event) {
            console.log(['Watch: ', event.path, ' (', event.type, ')' ].join(""));
        });
    gulp
        .watch('src/api-docs/*.scss', ['build-api-css'])
        .on('change', function(event) {
            console.log(['Watch: ', event.path, ' (', event.type, ')' ].join(""));
        });
});
