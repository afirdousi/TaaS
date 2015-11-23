'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var merge = require('merge-stream');

var bowerPath = 'bower_components';
var vendorPath = 'src/vendor';
var bowerFilesToCopy = {
    'angular': {
        js: ['angular.js', 'angular.min.js'],
        css: ['angular-csp.css']
    },
    'angular-bootstrap': {
        js: ['*.js']
    },
    'angular-mocks': {
        js: ['*.js']
    },
    'angular-ui-router': {
        js: ['release/*.js']
    },
    'angular-animate': {
        js: ['angular-animate.js', 'angular-animate.min.js']
    },
    'angular-fullscreen': {
        js: ['src/*.js']
    },
    'angular-ui-grid': {
        js: ['*.js'],
        css: ['*.css', '*.eot', '*.svg', '*.ttf', '*.woff']
    },
    'uri.js': {
        js: ['src/URI.js', 'src/URI.min.js']
    },
    'bootstrap': {
        js: ['dist/js/bootstrap.js', 'dist/js/bootstrap.min.js'],
        css: ['dist/css/*.css', 'dist/css/*.map'],
        fonts: ['dist/fonts/*']
    },
    'font-awesome': {
        css: ['css/*.css'],
        fonts: ['fonts/*']
    },
    'jquery': {
        js: ['dist/*.js', 'dist/*.map']
    },
    'jqueryui': {
        js: ['jquery-ui*.js']
    },
    'lodash': {
        js: ['*.js']
    },
    'moment': {
        js: ['moment.js', 'min/*.js']
    },
    'intro.js': {
        js: ['intro.js', 'minified/intro.min.js'],
        css: ['introjs.css', 'minified/introjs.min.css']
    },
    'masonry': {
        js: ['dist/*.js']
    },
    'perfect-scrollbar': {
        js: ['js/*.js', 'js/min/*.js'],
        css: ['css/*.css']
    }
};

gulp.task('vendor-files', function() {

    var streams = _(bowerFilesToCopy)
        .map(function(spec, name) {
            return _.map(spec, function(fileLst, fileType) {
                var filesToCopy = _.map(fileLst, function(fileName) {
                    return [ bowerPath, name, fileName ].join("/");
                });
                var destPath = [ vendorPath, name, fileType ].join("/");
                return gulp.src(filesToCopy).pipe(gulp.dest(destPath));
            });
        })
        .flatten()
        .value();

    return merge.apply(null, streams);
});
