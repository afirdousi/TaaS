'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var jsonMinify =  require('gulp-jsonminify');

gulp.task('build-other', function() {

    return merge(
        gulp.src('src/styles//**')
            .pipe(gulp.dest('dist/src/styles/')),
        gulp.src('src/app/data/*')
        	.pipe(jsonMinify())
            .pipe(gulp.dest('dist/src/app/data'))

    );
});
