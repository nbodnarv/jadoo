const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concatCss = require('gulp-concat-css');
const browserSync = require('browser-sync').create();

const autoPrefixBrowserList = ['last 7 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp.task('images', function () {
    return gulp.src('development/images/*.*')
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
        .pipe(gulp.dest('images/', { mode: '0777' }))
        .pipe(browserSync.stream());
});

gulp.task('vendorStyles', function () {
    return gulp.src('development/css/**/*.css')
        .pipe(plumber())
        .pipe(concatCss('vendor.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('styles/', { mode: '0777' }))
        .pipe(browserSync.stream());
});

gulp.task('styles', function () {
    return gulp.src('development/sass/**/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({ errLogToConsole: true, outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('styles/', { mode: '0777' }))
        .pipe(browserSync.stream());
});

gulp.task('vendorScripts', function () {
    return gulp.src('development/scripts/*.js')
        .pipe(plumber())
        .pipe(concat('vendor.min.js', { newLine: '\n;' }))
        .pipe(uglify())
        .pipe(gulp.dest('scripts/', { mode: '0777' }))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    return gulp.src('development/index.js')
        .pipe(plumber())
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('scripts/', { mode: '0777' }))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch('development/css/**/*.*', gulp.series('vendorStyles'));
    gulp.watch('development/sass/**/*.scss', gulp.series('styles'));
    gulp.watch('development/scripts/**/*.js', gulp.series('vendorScripts'));
    gulp.watch('development/index.js', gulp.series('scripts'));
    gulp.watch('development/images/**/*.*', gulp.series('images'));
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(['*.scss', '*.html', 'styles/**/*.css', 'scripts/**/*.js', 'images/**/*.*']).on('change', browserSync.reload);
});

gulp.task('build', gulp.parallel('images', 'vendorStyles', 'styles', 'vendorScripts', 'scripts'));

gulp.task('default', gulp.series('build', 'browserSync', 'watch'));