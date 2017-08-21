const fs      = require('fs');
const gulp    = require('gulp');
const del     = require('del');
const concat  = require('gulp-concat');
const connect = require('gulp-connect');
const header  = require('gulp-header');
const jshint  = require('gulp-jshint');
const livereload = require('gulp-livereload');
const open    = require('gulp-open');
const plumber = require('gulp-plumber');
const rename  = require('gulp-rename');
const sourcemaps    = require('gulp-sourcemaps');
const uglify  = require('gulp-uglify');
const karma   = require('karma').Server;

const SRC     = './src/';
const DIST    = './dist/';
const DEMO    = './demo/';
const TEST    = './test/';
const MODULE  = 'directives';

const config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),

  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n',

  // Files path
  html: {
    demo: DEMO + '**/*.html'
  },

  js: {
    src: SRC + '*.js',
    test: TEST + '*.js'
  }
};


// Tasks
// -----------------------------------------------------------------------------

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

// gulp.task('clean-dist', function(cb) {
//   return del([DIST], cb);
// });

gulp.task('open', function(){
  gulp.src(__filename)
    .pipe(open({
      uri: 'http://localhost:8080/demo',
      app: 'google chrome'
    }));
});

gulp.task('jshint', function() {
  return gulp.src([config.js.src])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { beep: true }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('scripts', ['jshint'], function(){
  const bannerDate = {
    timestamp: (new Date()).toISOString(), pkg: config.pkg
  };
  return gulp.src([config.js.src])
    // File copy on dist folder
    .pipe(header(config.banner, bannerDate))
    .pipe(gulp.dest(DIST))
    // Make min file on dist folder
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(uglify())
    .pipe(header(config.banner, bannerDate))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST))
    .pipe(livereload());
});


// Tasks: Demo page
// -----------------------------------------------------------------------------

gulp.task('demo-scripts', function() {
  gulp.src([
      'bower_components/angular/angular.min.js'
    ])
    .pipe(concat('demo-scripts.min.js'))
    .pipe(gulp.dest(DEMO));
});

gulp.task('demo-refresh', function () {
  gulp.src([config.html.demo])
    .pipe(livereload());
});


// Tasks: Unit testing
// -----------------------------------------------------------------------------

gulp.task('karma', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    singleRun: true
  }, done);
});

gulp.task('karma-serve', function(done){
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('jshint-test', function(){
  return gulp.src(config.js.test).pipe(jshint());
});


// Watchers
// -----------------------------------------------------------------------------

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch([config.js.src], ['scripts', 'karma']);
  gulp.watch([config.js.test], ['karma']);
  gulp.watch([config.html.demo], ['demo-refresh']);
});


// CLI tasks
// -----------------------------------------------------------------------------

gulp.task('default', ['serve']);
gulp.task('build', ['scripts']);
// Starts dev server watching changes on code, demo page and tests
gulp.task('serve', ['demo-scripts', 'build', 'connect', 'watch', 'open']);
// Run tests once
gulp.task('test', ['build', 'jshint-test', 'karma']);
// Run tests on Chrome and watch for changes
gulp.task('serve-test', ['build', 'watch', 'jshint-test', 'karma-serve']);
