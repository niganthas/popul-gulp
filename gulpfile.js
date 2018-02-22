const gulp = require('gulp'),
    bs     = require( 'browser-sync' ).create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat')
    htmlreplace = require('gulp-html-replace');



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


const jsFiles = [

]

const styleFiles = [
    './src/style/*.scss',
    './libs/**/*.scss',
    './libs/**/*.css'
]


//Server
gulp.task('webserver', ()=> {
  bs.init({
    server: {
      baseDir: './public'
    }
  });
})

//SASS
gulp.task('sass:dev', function () {
  return gulp.src(styleFiles)
      .pipe(sourcemaps.init())
      .pipe(sass({outFile: 'main-style.css'}).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(concat('style.css'))
      .pipe(gulp.dest(options.paths.public+'/css'));
});

gulp.task('sass:build', function () {
  return gulp.src(styleFiles)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(gulp.dest(options.paths.dist+'/css'));
});


gulp.task('dev', ['webserver', 'sass:dev'] ,() => {
  gulp.watch('./src/**/*.scss', ['sass:dev']);
  console.log('Develop mode')
})