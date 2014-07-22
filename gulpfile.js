var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var watch = require('gulp-watch');

gulp.task('default', function () {
	watch({ glob: 'public/img/*.{jpg,png,JPG}' }, function(files) {
		return files
		.pipe(imageResize({ width : 2048 }))
		.pipe(gulp.dest('public/resizedImg/'));
	});
});