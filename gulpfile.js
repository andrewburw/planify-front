const {dest,src,watch,parallel} = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const broeserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

function browsersync() {
    broeserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function images() {
    return src('app/images/**/*') 
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}
function styles() {
  return src('app/scss/style.scss')  
  .pipe(scss({outputStyle:'compressed'}))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true

  }))
  .pipe(dest('app/css'))
  .pipe( broeserSync.stream())
}
function build() {
    return src(['style.min.css',
'app/*.html'],{base:'app'})
.pipe(dest('dist'))
}
function watching() {
    watch(['app/scss/**/*.scss'],styles)
    watch(['app/*html']).on('change',broeserSync.reload)

    
}

exports.images = images;
exports.styles = styles;
exports.watching = watching;
exports.build =  build;
exports.browsersync = browsersync;

exports.default = parallel(browsersync,watching)