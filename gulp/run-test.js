'use strict';

var gulp = require('gulp');

gulp.task('tests', function(cb) {
    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: true,
        autoWatch: false
    }, cb);
});

gulp.task('watch-tests', function (cb) {
    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/../karma.conf.js',
        singleRun: false,
        autoWatch: true
    }, cb);
});
