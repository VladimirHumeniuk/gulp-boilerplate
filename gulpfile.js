var gulp = require('gulp'); 
var server = require('gulp-server-livereload'); // сервер
var sass = require('gulp-sass'); // компилирует sass в css 
var prefix = require('gulp-autoprefixer'); // проставляет префиксы для кроссбраузерности

var useref = require('gulp-useref'); // парсит специфичные блоки и конкатенирует описанные в них стили и скрипты.
var gulpif = require('gulp-if'); // учим uglify разделять css и js
var uglify = require('gulp-uglify'); // будет сжимать наш JS
var csso = require('gulp-csso'); // будет сжимать наш css

var imagemin = require('gulp-imagemin'); // минифицирует картинки
var cleanDest = require('gulp-dest-clean'); // подчищает билд проекта от ненужных файлов


// запускаем сервер
gulp.task('start', function(){
	gulp.src('app')
		.pipe(server({
			open: true,
			livereload: true
		}))
});

//replace
gulp.task('replaceFonts', function(){
	gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('build/fonts'))
})


// проставляем префиксы для последних 20 версий браузеров
gulp.task('style', function(){
	gulp.src('app/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
			versions: ['last 20 versions']
		}))
		.pipe(gulp.dest('app/css'))
});

// уменьшаем картинки
gulp.task('images', function () {
    gulp.src('./app/img/**/*')
    	.pipe(cleanDest('build/img'))
        .pipe(imagemin({
          progressive: true
        }))
        .pipe(gulp.dest('build/img'));
});

// отслеживаем изменения в sass файле и обновляем браузер
gulp.task('watch', function(){
	gulp.watch('app/sass/**/*.sass', ['style'])
});

// собираем наш проект
gulp.task("build", ['images'] ,function(){
	gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpif("*.css", csso()))
		.pipe(gulpif("*.js", uglify()))
		.pipe(gulp.dest('build'))
})

// дефолтный таск
gulp.task('default', ['start', 'watch'])