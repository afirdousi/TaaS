'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var merge = require('merge-stream');
var jsonMinify =  require('gulp-jsonminify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var tap = require('gulp-tap');
var findIncludes = require('../gulp-find-includes');
var replaceIncludes = require('../gulp-replace-includes');

var itemsFound = {
    cssAppGen: [],
    cssVendorGen: [],
    jsAppGen: [],
    jsVendorGen: []
};

gulp.task('clean-dist', function(cb) {
    del('./dist/**/*', cb);
});

gulp.task('find-dist-includes', function() {
    return gulp.src('src/index.html')
        .pipe(findIncludes({
            result: itemsFound
        }));
});

gulp.task('build-dist-assets', ['clean-dist'], function() {
    return merge(
        gulp.src('src/favicon.ico')
            .pipe(gulp.dest('dist/web')),
        gulp.src([ 'src/styles/**/*', '!src/styles/**/*.css', '!src/styles/**/*.map' ])
            .pipe(gulp.dest('dist/web/styles')),
        gulp.src('src/vendor/**/*')
            .pipe(gulp.dest('dist/web/vendor')),
        gulp.src([ 'src/app/**/*', '!src/app/**/*.js' ])
            .pipe(gulp.dest('dist/web/app')),
        gulp.src('src/app/data/*')
        	.pipe(jsonMinify())
            .pipe(gulp.dest('dist/web/app/data')),
        gulp.src('src/api-docs/**/*')
            .pipe(gulp.dest('dist/web/api-docs'))
    );
});

gulp.task('build-dist-css', ['clean-dist', 'find-dist-includes'], function() {

    var styleBundleFiles = _(itemsFound.css)
        .filter(function(name) { return /^styles/i.test(name); })
        .map(function(name) { return "src/" + name; })
        .value();
    var vendorStyleFiles = _(itemsFound.css)
        .filter(function(name) { return /^vendor/i.test(name); })
        .map(function(name) { return "src/" + name; })
        .value();

    var styleBundle = gulp
        .src(styleBundleFiles)
        .pipe(concat('made-styles.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(tap(addIncludeFileToList(itemsFound.cssAppGen)))
        .pipe(gulp.dest('dist/web/styles/css'));

    var vendorFiles = gulp
        .src(vendorStyleFiles, { base: 'src/vendor' })
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(tap(addIncludeFileToList(itemsFound.cssVendorGen)))
        .pipe(gulp.dest('./dist/web/vendor'));

    return merge(styleBundle, vendorFiles);
});

gulp.task('build-dist-js', ['clean-dist', 'find-dist-includes'], function() {

    var appScriptBundleFiles = _(itemsFound.js)
        .filter(function(name) { return /^app/i.test(name); })
        .map(function(name) { return "src/" + name; })
        .value();
    var vendorScriptBundleFiles = _(itemsFound.js)
        .filter(function(name) { return /^vendor/i.test(name); })
        .map(function(name) { return "src/" + name; })
        .value();

    var appScripts = gulp
        .src(appScriptBundleFiles)
        .pipe(uglify())
        .pipe(concat('made-bundle.js'))
        .pipe(rev())
        .pipe(tap(addIncludeFileToList(itemsFound.jsAppGen, "app/")))
        .pipe(gulp.dest('dist/web/app'));

    var vendorScripts = gulp
        .src(vendorScriptBundleFiles)
        .pipe(uglify())
        .pipe(concat('vendor-bundle.js'))
        .pipe(rev())
        .pipe(tap(addIncludeFileToList(itemsFound.jsVendorGen, "app/")))
        .pipe(gulp.dest('dist/web/app'));

    return merge(appScripts, vendorScripts);
});

gulp.task('build-dist-html', ['build-dist-css', 'build-dist-js'], function() {
    return gulp
        .src('src/index.html')
        .pipe(replaceIncludes(itemsFound))
        .pipe(gulp.dest('dist/web'));
});

gulp.task('build-dist', ['build-dist-assets', 'build-dist-css', 'build-dist-js', 'build-dist-html']);

gulp.task('show-dist-includes', ['find-dist-includes'], function() {
    console.log(JSON.stringify(itemsFound, null, 4));
});


function addIncludeFileToList(list, replacementPath) {
    var regex = replacementPath ? /^.*[\\\/]/ : /^.*[\\\/]src[\\\/]/;
    replacementPath = replacementPath || "";
    return function(file) {
        var basePath = file.path.replace(regex, replacementPath);
        basePath = basePath.replace(/\\/g, "/");
        list.push(basePath);
    };
}
