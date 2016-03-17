// Description

// Variables
var server = {
    host: 'localhost',
    port: '8001',
    https: true
}

var sp = {
    username: "Dominique",
    password: "Aveve2008",
    siteUrl: "http://cgk-dev-dominiq.cloudapp.net/",
    deployfolder: "_catalogs/masterpage/cgk/",
    domain: "devcegeka",
    doCheckIn: true
}

// Global Packages
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var spsave = require('gulp-spsave');

// Stylesheet Packages
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');

// Javascript Packages
var uglify = require('gulp-uglify');

// Stylesheet Tasks
// - Development
// -- SASS Task
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
// -- SASS Task
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
// - Production
// -- Uglify
gulp.task('uglify-prd', function() {
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./prd/_catalogs/masterpage/cgk/js'));
});

// Web Deployment Tasks
// - Run local webserver
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

// - Upload to SharePoint
gulp.task("spsavecss",['postcss-prd'],  function(){
    return gulp.src("./prd/_catalogs/masterpage/cgk/css/*.*")
        .pipe(spsave({
            username: sp.username,
            password: sp.password,
            domain: sp.domain,
            siteUrl: sp.siteUrl,
            folder: sp.deployfolder + "css",
            checkin: sp.doCheckIn,
            checkinType: 'major'
        }));
});
gulp.task("spsavefonts", function () {
    return gulp.src("./prd/_catalogs/masterpage/cgk/fonts/*.*")
        .pipe(spsave({
            username: sp.username,
            password: sp.password,
            domain: sp.domain,
            siteUrl: sp.siteUrl,
            folder: sp.deployfolder + "fonts",
            checkin: sp.doCheckIn,
            checkinType: 'major'
        }));
});
gulp.task("spsavejs",['uglify-prd'], function () {
    return gulp.src("./prd/_catalogs/masterpage/cgk/js/*.*")
        .pipe(spsave({
            username: sp.username,
            password: sp.password,
            domain: sp.domain,
            siteUrl: sp.siteUrl,
            folder: sp.deployfolder + "js",
            checkin: sp.doCheckIn,
            checkinType: 'major'
        }));
});
gulp.task("spsaveimg", function () {
    return gulp.src("./prd/_catalogs/masterpage/cgk/img/*.*")
        .pipe(spsave({
            username: sp.username,
            password: sp.password,
            domain: sp.domain,
            siteUrl: sp.siteUrl,
            folder: sp.deployfolder + "img",
            checkin: sp.doCheckIn,
            checkinType: 'major'
        }));
});
gulp.task("spsavepl", function () {
    return gulp.src("./prd/_catalogs/masterpage/cgk/page layouts/*.*")
        .pipe(spsave({
            username: sp.username,
            password: sp.password,
            domain: sp.domain,
            siteUrl: sp.siteUrl,
            folder: sp.deployfolder + "page layouts",
            checkin: sp.doCheckIn,
            checkinType: 'major'
        }));
});
gulp.task("spsavedt", function () {
    return gulp.src("./prd/_catalogs/masterpage/cgk/display templates/*.*")
        .pipe(spsave({
            username: sp.username,
            password: sp.password,
            domain: sp.domain,
            siteUrl: sp.siteUrl,
            folder: sp.deployfolder + "display templates",
            checkin: sp.doCheckIn,
            checkinType: 'major'
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
gulp.task('deploy', ['spsavecss', 'spsavejs', 'spsavefonts', 'spsaveimg', 'spsavepl', 'spsavedt']);
