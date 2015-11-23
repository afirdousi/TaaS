'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

gulp.task('web-api-tests', function() {
    return gulp.src('test/integration/web-apis/*.spec.js')
        .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
});
