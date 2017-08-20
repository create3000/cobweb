'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package');
var scripts = {
      name: 'jquery.contextMenu.js',
      min: 'jquery.contextMenu.min.js',
      all: [
        'gulpfile.js',
        'src/jquery.contextMenu.js',
        'dist/jquery.contextMenu.js'
      ],
      main: 'dist/jquery.contextMenu.js',
      src: [
          'src/jquery.contextMenu.js'
      ],
      dest: 'dist',
      libs: [
          'bower_components/jquery-ui/ui/position.js',
          'bower_components/jquery-ui/ui/minified/position.min.js'
      ]
    };
var styles = {
      name: 'jquery.contextMenu.css',
      min: 'jquery.contextMenu.min.css',
      all: [
        'src/*.css'
      ],
      main: 'dist/jquery.contextMenu.css',
      src: 'src/jquery.contextMenu.css',
      dest: 'dist'
    };
var images  = {
    src: 'src/images/*',
    dest: 'dist/images/'
}

var replacement = {
      regexp: /@\w+/g,
      filter: function (placeholder) {
        switch (placeholder) {
          case '@VERSION':
            placeholder = pkg.version;
            break;

          case '@YEAR':
            placeholder = (new Date()).getFullYear();
            break;

          case '@DATE':
            placeholder = (new Date()).toISOString();
            break;
        }

        return placeholder;
      }
    };

gulp.task('img', function(){
    return gulp.src(images.src)
        .pipe(gulp.dest(images.dest));
});

gulp.task('jshint', function () {
  return gulp.src(scripts.all).
    pipe(plugins.jshint('src/.jshintrc')).
    pipe(plugins.jshint.reporter('default'));
});

gulp.task('jscs', function () {
  return gulp.src(scripts.all).
    pipe(plugins.jscs('src/.jscsrc'));
});

gulp.task('js', ['jshint', 'jscs', 'jslibs'], function () {
  return gulp.src(scripts.src).
    pipe(plugins.sourcemaps.init()).
    pipe(plugins.replace(replacement.regexp, replacement.filter)).
    pipe(gulp.dest(scripts.dest)).
    pipe(plugins.rename(scripts.min)).
    pipe(plugins.uglify({
      preserveComments: 'some'
    })).
    pipe(plugins.sourcemaps.write('.')).
    pipe(gulp.dest(scripts.dest));
});

gulp.task('jslibs', function (){
    return gulp.src(scripts.libs).
        pipe(plugins.rename({prefix: 'jquery.ui.'})).
        pipe(gulp.dest('src')).
        pipe(gulp.dest('dist'));
});

gulp.task('csslint', function () {
  return gulp.src(styles.all).
    pipe(plugins.csslint('src/.csslintrc')).
    pipe(plugins.csslint.reporter());
});

gulp.task('css', ['csslint'], function () {
  return gulp.src(styles.src).
      pipe(plugins.sourcemaps.init()).
    pipe(plugins.replace(replacement.regexp, replacement.filter)).
    pipe(plugins.autoprefixer({
      browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 8',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
      ]
    })).
    pipe(plugins.csscomb('src/.csscomb.json')).
    pipe(gulp.dest(styles.dest)).
    pipe(plugins.rename(styles.min)).
    pipe(plugins.minifyCss()).
    pipe(plugins.sourcemaps.write('.')).
    pipe(gulp.dest(styles.dest));
});


gulp.task('watch', function () {
  gulp.watch(scripts.src, ['js']);
  gulp.watch(styles.src, ['css']);
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['watch']);
