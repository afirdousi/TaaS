'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var merge = require('merge-stream');
var jsHint = require('gulp-jshint');

var jsHintDefaults = {
    camelcase: true,
    curly: true,
    eqeqeq: true,
    forin: true,
    freeze: true,
    globals: {
        'angular': true,
        '_': true,
        'moment': true
    },
    immed: true,
    latedef: "nofunc",
    noarg: true,
    nocomma: false,
    nonbsp: true,
    shadow: "inner",
    undef: true,
    unused: true,
    strict: true
};

gulp.task('validate-js', function() {

    var gulpFiles = gulp.src([
            'gulpfile.js',
            'gulp/*.js'
        ])
        .pipe(jsHint(_.defaults({
            node: true,
            globals: {
                'buildOptions': true
            }
        }, jsHintDefaults)))
        .pipe(jsHint.reporter('default', {
            verbose: true
        }))
        .pipe(jsHint.reporter('fail'));

    var appFiles = gulp.src([
            'src/app/**/*.js'
        ])
        .pipe(jsHint(_.defaults({
            camelcase: false
        }, jsHintDefaults)))
        .pipe(jsHint.reporter('default', {
            verbose: true
        }))
        .pipe(jsHint.reporter('fail'));

    return merge(gulpFiles, appFiles);
});
