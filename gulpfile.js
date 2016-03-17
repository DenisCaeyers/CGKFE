// Description

// Variables
var server = {
    host: 'localhost',
    port: '8001',
    https: false
}

// Global Packages
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

// Stylesheet Packages
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');

// Javascript Packages
var uglify = require('gulp-uglify');

// Stylesheet Tasks
// - Development
// -- General Build Task
gulp.task('sass-dev', function () {
  return gulp.src([
      './src/scss/**/*.scss',
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dev/css'));
});
// -- Post CSS Task
gulp.task('postcss-dev', ['sass-dev'], function () {
  var processors = [
    autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }),
  ];
  return gulp.src('./dev/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dev/css'))
    .pipe(livereload());
});
// - Production
// -- General Build Task
gulp.task('sass-prd', function () {
  return gulp.src([
      './src/scss/**/*.scss',
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./prd/_catalogs/masterpage/cgk/css'));
});
// -- Post CSS Task
gulp.task('postcss-prd', ['sass-prd'], function () {
  var processors = [
    autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }),
  ];
  return gulp.src('./prd/_catalogs/masterpage/cgk/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./prd/_catalogs/masterpage/cgk/css'))
    .pipe(livereload());
});

// Javascript Tasks
// - Development

// - Production
// -- Uglify
gulp.task('uglify-prd', function() {
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./prd/_catalogs/masterpage/cgk/js'));
});

// Webserver Tasks
gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      https:            server.https,
      directoryListing: false
    }));
});

// Watch Tasks
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*', ['dev']); 
});

// Watch, development, production and deployment Tasks
gulp.task('default',['dev', 'webserver', 'watch']);
gulp.task('dev' ,['postcss-dev']);
gulp.task('prd' ,['postcss-prd','uglify-prd']);
gulp.task('deploy', ['prd'])
