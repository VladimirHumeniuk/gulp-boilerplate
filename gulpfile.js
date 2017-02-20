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
	gulp.src('app') // указываем папку, в которой мы делаем сайт
		.pipe(server({
			open: true, // сразу открываем браузер
			livereload: true // поднимаем сервер
		}))
});

// готовим css
gulp.task('style', function(){
	gulp.src('app/sass/**/*.sass') //указывая такой путь, мы говорим плагину компилировать все файлы в папке app/sass
		.pipe(sass().on('error', sass.logError)) // выводим ошибки компиляции в консоль при их возникновении
		.pipe(prefix({
			versions: ['last 20 versions'] // проставляем префиксы для последних 20 версий браузеров
		}))
		.pipe(gulp.dest('app/css')) //исходящяя папка для css файлов
});

// уменьшаем картинки
gulp.task('images', function () {
    gulp.src('./app/img/**/*') //указывая такой путь, мы говорим плагину компилировать все файлы в папке app/img
    	.pipe(cleanDest('build/img')) // папка, за которой следить плагину dest-clean, чтобы в продакшн версию проекта не попали лишние картинки
        .pipe(imagemin({
          progressive: true
        }))
        .pipe(gulp.dest('build/img')); // папка, в которую будут поступать оптимизированные картинки
});

// отслеживаем изменения в sass файлах чтобы сразу компилировать их в css
gulp.task('watch', function(){
	gulp.watch('app/sass/**/*.sass', ['style'])
});

// собираем наш проект
gulp.task("build", ['images'] ,function(){
	gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpif("*.css", csso())) // говорим, что для css файлов применять плагин csso
		.pipe(gulpif("*.js", uglify())) // а для js файлов плагин uglify
		.pipe(gulp.dest('build')) // указываем корневую папку для билда
});

// дефолтный таск
gulp.task('default', ['start', 'watch']);

