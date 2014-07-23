var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var watch = require('gulp-watch');

gulp.task('default', function () {
	watch({ glob: 'public/img/*.{jpg,png,JPG}' }, function(files) {
		return files
		.pipe(imageResize({ width : 2048 }))
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest('public/resizedImg/'));
	});
});