'use strict';

var minimist = require('minimist');
global.buildOptions = minimist(
    process.argv.slice(2),
    {
        'boolean': ['release'],
        'default': {
            release: false
        }
    });

var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');
requireDir('./gulp');

gulp.task('build', function(done) {
    runSequence('validate-js', 'tests', 'build-dist', done);
});
gulp.task('build-no-tests', function(done) {
    runSequence('validate-js', 'build-dist', done);
});
gulp.task("default", ['validate-js','dev']);
gulp.task('dev',['web','openbrowser']);
gulp.task('release-qa',['ftpweb']);
gulp.task('release',['validate-js','build','tests','ftpweb']);


