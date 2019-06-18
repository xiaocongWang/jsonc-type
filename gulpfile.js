var gulp = require('gulp');
const destPath = './dist';

gulp.task('copy', () => {
    return gulp.src([
        'package.json',
        'README.md'
    ])
    .pipe(gulp.dest(destPath))
    .on('error', (e) => {
        throw e;
    });
});

gulp.task('default', ['copy']);