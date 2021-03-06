const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const babel = require('gulp-babel');

var paths = {
  src: ['/app/src/*.js'],
  dist: '/app/dist',
};

gulp.task('start', function () {
  nodemon({script: paths.dist + '/app.js', ext: 'js hjs json', legacyWatch: true });
});

gulp.task('babel', function() {
  return gulp.src(paths.src)
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', function(err) {
      console.log('>>> ERROR', err);
      this.emit('end');
    })
    .pipe(gulp.dest(paths.dist))
});

gulp.watch(paths.src, ['babel']);

gulp.task('default', ['babel','start']);
