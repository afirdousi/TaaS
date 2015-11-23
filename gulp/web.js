'use strict';

var gulp = require('gulp');
var opn = require('opn');

gulp.task('web', function(cb) {
    var webSrv;
    global.webSettings = (global.webSettings || {});
    /**commenting this so that useBuild property should read from websettings.js*/
    //global.webSettings.useBuild = false;
    require("../express-server.js")
        .then(function(webSrv) {
            webSrv.on('exit', function() {
                cb();
            });
        });
});

gulp.task('web-build', function(cb) {
    var webSrv;
    global.webSettings = (global.webSettings || {});
    global.webSettings.useBuild = true;
    require("../express-server.js")
        .then(function(webSrv) {
            webSrv.on('exit', function() {
                cb();
            });
        });
});

gulp.task('openbrowser', function() {
  opn('http://localhost:9955');
});


