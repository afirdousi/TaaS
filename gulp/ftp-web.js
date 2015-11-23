'use strict';

var gulp = require('gulp');
var sftp = require('gulp-sftp');
 
gulp.task('ftpweb', function () {

	console.log(__dirname);
    return gulp.src(__dirname +  '\\..\\**\\*.*')
        .pipe(sftp({
            host: 'hfdvrtsejboss1.vm.itg.corp.us.shldcorp.com',
            user: 'rtseadm',
            pass: 'rtse1@3adm',
            remotePath: '/appl/made/deployables/'
        }));
});