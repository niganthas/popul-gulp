const gulp = require('gulp'),
    bs     = require( 'browser-sync' ).create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat')
    htmlreplace = require('gulp-html-replace'),
    ejs = require('gulp-ejs')
    uglify = require('gulp-uglify');
    pump = require('pump');

//Included libs
const libPath = './bower_components'
const libsFilesJs = [
  libPath+'/jquery/dist/jquery.js',
  libPath+'/bootstrap/dist/js/bootstrap.js',
]

const libsFilesCss = [
]


const options = {
  paths: {
    public: './public',
    dist: './build',
    source: './src',
  },
  bs: {
    proxy: 'http://localhost:3000'
  }
};





const styleFiles = [
    './src/style/*.scss'
]


//Server
gulp.task('webserver', ()=> {
  bs.init({
    server: {
      baseDir: './public'
    }
  });
})
//DEVELOPMENT TASks
//EJS
gulp.task('ejs:dev', () => {
  return gulp.src('./src/html/*.ejs')
      .pipe(ejs({ msg: 'Hello Gulp!'}, {}, { ext: '.html' }))
      .pipe(gulp.dest(options.paths.public))
      .pipe(bs.stream());
})


//SASS
gulp.task('sass:dev', () => {
  return gulp.src(styleFiles)
      .pipe(sass({outFile: 'main-style.css'}).on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(gulp.dest(options.paths.public+'/css'))
      .pipe(bs.stream());
});

gulp.task('libsJs:dev', (cb)=> {
  pump([
    gulp.src(libsFilesJs),
    uglify(),
    concat('libs.js'),
    gulp.dest(options.paths.public+'/js'),
    bs.stream()
  ], cb)
});


gulp.task('js:dev', (cb)=> {
  pump([
    gulp.src('./src/js/*.js'),
    uglify(),
    concat('bundle.js'),
    gulp.dest(options.paths.public+'/js'),
    bs.stream()
  ], cb)
});


//BUILD TASKS

gulp.task('sass:build', () => {
  return gulp.src(styleFiles)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(gulp.dest(options.paths.dist+'/css'));
});


gulp.task('dev', ['webserver', 'sass:dev', 'ejs:dev', 'libsJs:dev', 'js:dev'] ,() => {
  gulp.watch('./src/**/*.scss', ['sass:dev']);
  gulp.watch(['./src/html/*.ejs', './src/html/includes/*.ejs'], ['ejs:dev']);
  gulp.watch('./src/js/*.js', ['js:dev']);
  console.log('Develop mode')
})