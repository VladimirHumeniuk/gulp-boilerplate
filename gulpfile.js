let gulp 	    = require('gulp');
	// server    = require('gulp-server-livereload');
	sass        = require('gulp-sass');
	prefix      = require('gulp-autoprefixer');
	useref      = require('gulp-useref');
	pug         = require('gulp-pug'),
	gulpif      = require('gulp-if');
	uglify      = require('gulp-uglify');
	csso        = require('gulp-csso');
	imagemin    = require('gulp-imagemin');
	cleanDest   = require('gulp-dest-clean');
	media       = require('gulp-merge-media-queries');
	critical    = require('critical').stream;
	gutil       = require('gulp-util');
	htmlmin     = require('gulp-htmlmin');
	browserSync = require('browser-sync');
	reload      = browserSync.reload;

// gulp.task('start', () =>
// 	gulp.src('app')
// 		.pipe(server({
// 			open: true,
// 			livereload: true
// 		}))
// );

gulp.task('browser-sync', () =>
	browserSync({
		server: {
			baseDi: './'
		},
			startPath: 'app/index.html'
	})
);

gulp.task('style', () =>
	gulp.src('app/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
			versions: ['last 20 versions']
		}))
		.pipe(media())
		.pipe(gulp.dest('app/css'))
);

gulp.task('critical', function () {
    return gulp.src('build/*.html')
        .pipe(critical({
			base:    'build/',
			minify:  true,
			extract: false,
			inline:  true,
			// ignore:  ['@font-face'],
			css:     ['build/css/style.min.css']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('build'));
});

gulp.task('pug', () =>
    gulp.src('app/pug/*.pug')
        .pipe(pug({
            pretty: '\t'
        }))
        .pipe(gulp.dest('app/'))
);

gulp.task('images', () =>
    gulp.src('./app/img/**/*')
    	.pipe(cleanDest('build/img'))
        .pipe(imagemin({
            progressive: true,
			quality: 50,
			smooth: 30
        }))
        .pipe(gulp.dest('build/img'))
);

gulp.task('fonts', () =>
  gulp.src(('./app/fonts/**/*'), ['*.eot','*.svg','*.ttf','*.woff','*.woff2'])
    .pipe(gulp.dest('build/fonts'))
);

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.sass', ['style']);
    gulp.watch('app/pug/**/*.pug', ['pug']);
});

// gulp.task('htmlmin', function() {
//   return gulp.src('app/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('build/'));
// });

gulp.task("build", ['images', 'fonts', 'htmlmin'], () =>
	gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpif("*.css", csso()))
		.pipe(gulpif("*.js", uglify()))
		.pipe(gulp.dest('build'))
);

gulp.task('default', ['start', 'watch', 'changed']);
