
var gulp        = require('gulp'),
    scss        = require('gulp-scss'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnamo     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autopref    = require('gulp-autoprefixer');

gulp.task('scss', function () {
    return gulp.src('app/scss/*.scss')
        .pipe(scss())
        .pipe(autopref(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/bxSlider-4/dist/jquery.bxslider.min'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['scss'], function () {
   return gulp.src('app/css/libs.css')
       .pipe(cssnamo())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('app/css'))
});

gulp.task('css-fonts', function () {
   return gulp.src('app/css/font-awesome.css')
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('app/css'))
});


gulp.task('img', function () {
   return gulp.src('app/img/**/*')
       .pipe(cache(imagemin({
           interlaced: true,
           progressive: true,
           svgoPlugins: [{removeViewBox: false}],
           une: [pngquant()]
       })))
       .pipe(gulp.dest('dist/img'))
});

gulp.task('clean', function () {
   return del.sync('dist');
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'scss', 'scripts', 'img', 'css-fonts'], function () {
    var buildCss = gulp.src([
        'app/css/main.min.css',
        'app/css/libs.min.css',
        'app/css/font-awesome.min.css'
    ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJS = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['watch']);