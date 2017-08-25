const fs      = require('fs');
const gulp    = require('gulp');
const clean   = require('gulp-clean');
const concat  = require('gulp-concat');
const connect = require('gulp-connect');
const ghPages = require('gulp-gh-pages');
const header  = require('gulp-header');
const inject  = require('gulp-inject');
const jshint  = require('gulp-jshint');
const livereload = require('gulp-livereload');
const open    = require('gulp-open');
const plumber = require('gulp-plumber');
const rename  = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify  = require('gulp-uglify');
const karma   = require('karma').Server;

const paths = {
  src:  './src',
  dist: './dist',
  demo: './demo',
  demo_build: './demo_build',
  libs: './bower_components',
  test: './test'
};

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
    demo: paths.demo + '/*.html',
    demo_build: paths.demo_build + '/*.html'
  },

  js: {
    demo: paths.demo + '/*.js',
    demo_build: paths.demo_build + '/*.js',
    src:  paths.src + '/*.js',
    test: paths.test + '/*.js'
  }
};

function demoScripts(){
  return [
    paths.libs + '/angular/angular.min.js',
    paths.demo + '/*.js',
    paths.dist + '/*.min.js'
  ];
}

// Tasks
// -----------------------------------------------------------------------------

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

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
    .pipe(gulp.dest(paths.dist))
    // Make min file on dist folder
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(uglify())
    .pipe(header(config.banner, bannerDate))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist))
    .pipe(livereload());
});


// Tasks: Demo page
// -----------------------------------------------------------------------------

gulp.task('demo-scripts', function() {
  var target = gulp.src(config.html.demo);
  var sources = gulp.src(demoScripts(), {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest(paths.demo));
});

gulp.task('demo-refresh', function () {
  gulp.src([config.html.demo])
    .pipe(livereload());
});


// Tasks: Demo build page to github pages
// -----------------------------------------------------------------------------

gulp.task('build-demo__clean-js', function(cb) {
  return gulp.src(config.js.demo_build, {read: false}).pipe(clean());
});

gulp.task('build-demo__clean-html', function(cb) {
  return gulp.src(config.html.demo_build, {read: false}).pipe(clean());
});

// Concat demo script and it's dependencies
gulp.task('build-demo__scripts', ['build-demo__clean-js'], function() {
  return gulp.src(demoScripts())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.demo_build));
});

// Just copying the demo HTML file
gulp.task('build-demo__html', ['build-demo__clean-html'], function() {
  return gulp.src(config.html.demo).pipe(gulp.dest(paths.demo_build));
});

gulp.task('build-demo__page', ['build-demo__scripts', 'build-demo__html'], function() {
  var target  = gulp.src(config.html.demo_build);
  var sources = gulp.src(config.js.demo_build, {read: false});

  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest(paths.demo_build));
});

gulp.task('build-demo__deploy', function() {
  return gulp.src(paths.demo_build + '/**/*')
    .pipe(ghPages({force: true}));
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
  gulp.watch([config.html.demo, config.js.demo], ['demo-refresh']);
});


// CLI tasks
// -----------------------------------------------------------------------------

gulp.task('default', ['serve']);
gulp.task('build', ['test', 'scripts']);
gulp.task('build-demo', ['build-demo__page']);
// Starts dev server watching changes on code, demo page and tests
gulp.task('serve', ['build', 'demo-scripts', 'connect', 'watch', 'open']);
// Run tests once
gulp.task('test', ['scripts', 'jshint-test', 'karma']);
// Run tests on Chrome and watch for changes
gulp.task('serve-test', ['build', 'watch', 'jshint-test', 'karma-serve']);
// Deploy github page to show the demo
gulp.task('deploy-ghpages', ['build-demo__deploy']);
