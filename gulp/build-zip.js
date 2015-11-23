var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var zip = require('gulp-zip');

gulp.task('copy-src',function(cb){
	return gulp.src('src/**/*').pipe(gulp.dest('./build/made/app/src/'),cb);
});

gulp.task('copy-dist',function(cb){
	return gulp.src('dist/**/*').pipe(gulp.dest('./build/made/app/dist/'),cb);
});

gulp.task('copy-server',function(){
	return gulp.src('server/**/*').pipe(gulp.dest('./build/made/app/server/'));
});

gulp.task('copy-adminscripts',function(){
	return gulp.src('adminScripts/**/*').pipe(gulp.dest('./build/made/app/adminScripts/'));
});

gulp.task('copy-app-files',function(){
	return gulp.src(['express-server.js', 'package.json', 'styles.xml']).pipe(gulp.dest('./build/made/app/'));
});

gulp.task('clean-build', function(cb) {
    del(['build/made', 'build/mde.zip'],cb);
    
});

gulp.task('copy-files', function(cb){
	runSequence('clean-build', 'copy-app-files', 'copy-dist', 'copy-src', 'copy-server', 'copy-adminscripts', cb);
});

gulp.task('archive', function () {
    return gulp.src('build/made/**/*')
        .pipe(zip('mde.zip'))
        .pipe(gulp.dest('./build/'));
});


gulp.task('build-zip', function(cb){
	runSequence('copy-files', 'archive',cb);
});