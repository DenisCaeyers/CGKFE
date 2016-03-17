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
var sourcemaps = require('gulp-sourcemaps');

// Stylesheet Packages
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');
var iconfont = require('gulp-iconfont');

// Javascript Packages
var uglify = require('gulp-uglify');

// Image & font packages
var iconfont = require('gulp-iconfont');
var rename = require('gulp-rename');
var consolidate = require('gulp-consolidate');

// Web Deployment packages
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var spsave = require('gulp-spsave');

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

// Image & Font Tasks
// -- Font generator
gulp.task('iconfont-dev', function () {
    // Variables
    var iconFontName = 'cgkFont';

    // Normalized setting (SVG's are exported with a 500px height)
    var iconFontSettings = {
        fontName: iconFontName,
        fixedWith: false,
        normalize: true,
        appendCodepoints: false,
        centerHorizontally: true,
        fontHeight: 1001 // IMPORTANT
    };

    return gulp.src(['./src/icons/*.svg'])
      .pipe(iconfont(iconFontSettings))
      .on('glyphs', function (glyphs) {
          var options = {
              glyphs: glyphs.map(function (glyph) {
                  //process.stdout.write(JSON.stringify(glyph));
                  //process.stdout.write('\n');
                  // this line is needed because gulp-iconfont has changed the api from 2.0
                  return {
                      name: glyph.name,
                      codePoint: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
                  }
              }),
              fontName: iconFontName,
              version: variables.version,
              filename: './src/src/iconfonts.scss',
              fontPath: './dev/fonts/', // set path to font (from your CSS file if relative)
              cssClass: 'cgkIcon' // set class name in your CSS
          };

          gulp.src('./src/icons/example/_template.scss.nunj')
            .pipe(consolidate('nunjucks', options))
            .pipe(rename('_icons.scss'))
            .pipe(gulp.dest('./src/scss/scss/')); // set path to export your SCSS

          // Sample HTML
          gulp.src('./src/icons/example/list-icons.html.nunj')
            .pipe(consolidate('nunjucks', options))
            .pipe(rename('list-icons.html'))
            .pipe(gulp.dest('./dev/fonts/example/')); // set path to export your sample HTML
      })
      .pipe(
        gulp.dest('./src/dev/fonts/')
      );
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
