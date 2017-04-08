let gulp = require('gulp'); 
	server = require('gulp-server-livereload'); // сервер
	sass = require('gulp-sass'); // компилирует sass в css 
	prefix = require('gulp-autoprefixer'); // проставляет префиксы для кроссбраузерности
	useref = require('gulp-useref'); // парсит специфичные блоки и конкатенирует описанные в них стили и скрипты.
	gulpif = require('gulp-if'); // учим uglify разделять css и js
	uglify = require('gulp-uglify'); // будет сжимать наш JS
	csso = require('gulp-csso'); // будет сжимать наш css
	imagemin = require('gulp-imagemin'); // минифицирует картинки
	cleanDest = require('gulp-dest-clean'); // подчищает билд проекта от ненужных файлов
	changed = require('gulp-changed'); // отслеживает изменения в файлах.


// запускаем сервер
gulp.task('start', () =>
	gulp.src('app') // указываем папку, в которой мы делаем сайт
		.pipe(server({
			open: true, // сразу открываем браузер
			livereload: true // поднимаем сервер
		}))
);

// готовим css
gulp.task('style', () =>
	gulp.src('app/sass/**/*.sass') //указывая такой путь, мы говорим плагину компилировать все файлы в папке app/sass
		.pipe(sass().on('error', sass.logError)) // выводим ошибки компиляции в консоль при их возникновении
		.pipe(prefix({
			versions: ['last 20 versions'] // проставляем префиксы для последних 20 версий браузеров
		}))
		.pipe(gulp.dest('app/css')) //исходящяя папка для css файлов
);

// уменьшаем картинки
gulp.task('images', () =>
    gulp.src('./app/img/**/*') //указывая такой путь, мы говорим плагину компилировать все файлы в папке app/img
    	.pipe(cleanDest('build/img')) 
        .pipe(imagemin({
            progressive: true,
			quality: 50,
			smooth: 30
        }))
        .pipe(gulp.dest('build/img')) // папка, в которую будут поступать оптимизированные картинки
);

// переносим шрифты в билд
gulp.task('fonts', () =>
  gulp.src(('./app/fonts/**/*'), ['*.eot','*.svg','*.ttf','*.woff','*.woff2'])  
    .pipe(gulp.dest('build/fonts'))                                    
);

// отслеживаем изменения в sass файлах чтобы сразу компилировать их в css
gulp.task('watch', () =>
	gulp.watch('app/sass/**/*.sass', ['style'])
);

// смотрим за sass файлами, чтобы каждый раз не компилировать в сss все файлы, а только измененные
gulp.task('changed', () =>
    gulp.src('app/sass/**/*.sass')
         .pipe(changed('app/sass', {extension: '.sass'}))
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
);

// собираем наш проект
gulp.task("build", ['images', 'fonts'], () =>
	gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpif("*.css", csso())) // говорим, что для css файлов применять плагин csso
		.pipe(gulpif("*.js", uglify())) // а для js файлов плагин uglify
		.pipe(gulp.dest('build')) // указываем корневую папку для билда
);

// дефолтный таск
gulp.task('default', ['start', 'watch', 'changed']);