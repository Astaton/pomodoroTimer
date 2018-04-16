const gulp = require('gulp');
const gulpAutoprefix = require('gulp-autoprefixer');
const gulpHtmlMin = require('gulp-htmlmin');

const src_html = 'public/*.html';
const src_css = 'src/*.css';
const dest_html = 'public/';
const dest_css = 'src/';



//adds css prefixes to ensure compatibility with 99.5% of browsers used in the US
gulp.task('prefixes', function(){
	gulp.src(src_css)
		.pipe(gulpAutoprefix({
			browsers:['cover 99.5% in US']
		}))
		.pipe(gulp.dest(dest_css))
});

//minifies html files
gulp.task('htmlMini', function(){
	gulp.src(src_html)
	.pipe(gulpHtmlMin({
		collapseWhitespace:true,
		minifyCSS: true
	}))
	.pipe(gulp.dest(dest_html))
})