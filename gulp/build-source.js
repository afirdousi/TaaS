'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var gulpRev = require('gulp-rev');
var gulpConcat = require('gulp-concat');
var gulpUglify = require('gulp-uglify');
var gulpMinifyCss = require('gulp-minify-css');
var gulpAppendRev = require('gulp-rev-append');
var jeditor = require('gulp-json-editor');

gulp.task('build-source-includes', function() {

    var appCode = gulp.src([
            'src/app/module/mainAppModule.js',
            'src/app/**/*.js'
        ])
        .pipe(gulpConcat('bundle.js'))
        .pipe(gulpUglify())
        .pipe(gulpRev())
        .pipe(gulp.dest('dist/src/js'));

   /* var appCss = gulp.src('src/css/app.css')
        .pipe(gulpMinifyCss())
        .pipe(gulpRev())
        .pipe(gulp.dest('dist/web/css'));*/

    var vendorCode = gulp.src('src/vendor/**/js/*.min.js')
        .pipe(gulpUglify())
        .pipe(gulpRev())
        .pipe(gulp.dest('dist/src/vendor/'));


    var vendorCss = gulp.src('src/vendor/**/css/*.css')
        .pipe(gulpRev())
        .pipe(gulpMinifyCss())
        .pipe(gulp.dest('dist/src/vendor/'));

    return merge(appCode, /*appCss, */vendorCode, vendorCss);
});

gulp.task('build-source', ['build-source-includes'], function() {

    var shellHtmlFiles = gulp.src('src/index.html')
        .pipe(gulpAppendRev({
            root: '/'
        }))
        .pipe(gulp.dest('dist/src/'));

    var partialHtmlFiles = gulp.src([
            'src/app/views/**/*.html'
        ])
        .pipe(gulp.dest('dist/src/app/views'));

    var directiveHtmlFiles = gulp.src([
            'src/app/directives/views/*.html'
        ])
        .pipe(gulp.dest('dist/src/app/directives/views'));

     var expressServer = gulp.src('express-server.js')
        .pipe(gulpAppendRev({
            root: '/'
        }))
        .pipe(gulp.dest('dist/'));

    var packageJson = gulp.src('package.json')
        .pipe(jeditor(function(json){
            json.name = 'MADE Production';
            json.version = '1.0.0';
            json.license = 'Sears';
            json.dependencies = {
            "express": "^4.11.1",
            "http-proxy": "^1.8.1",
            "lodash": "^3.0.0"
            }; 

            json.devDependencies={};          
            return json;
        }))
        .pipe(gulp.dest('dist/'));

    return merge(shellHtmlFiles, partialHtmlFiles,directiveHtmlFiles, expressServer, packageJson);
});
