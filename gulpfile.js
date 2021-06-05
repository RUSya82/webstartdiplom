var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
const concat = require("gulp-concat");
const autoprefix = require("gulp-autoprefixer");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
// require("@babel/core").transformSync("code", {
//     plugins: ["@babel/plugin-syntax-class-properties"]
// });

// source directories
const sourceSass = "./app/sass/main.sass";
const sourceJS = "./app/js/main.js";

// dist directories
const distJS = "./dist/js/";
const distCSS = "./dist/css/";
const dist = "./dist/";



gulp.task("build-js", () => {
    return gulp.src(sourceJS)
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: false,
            devtool: "source-map",

            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components|swiper)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage",
                                }]],

                            },
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(distJS))
        .on("end", browserSync.reload);
});
gulp.task("build-prod-js", () => {
    return gulp.src("app/js/main.js")
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.js'
            },
            watch: false,
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components|swiper)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(distJS))
        .on("end", browserSync.reload);
});
gulp.task('sass', () => {
    return gulp.src(sourceSass)
        .pipe(sass({
             // outputStyle: 'compressed'
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefix({
            browsersList: ['last 8 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(distCSS))
        .pipe(browserSync.stream());
});

gulp.task('html', () => {
				return gulp.src("app/*.html")
					.pipe(gulp.dest(dist))
                    .pipe(browserSync.stream());
	});
gulp.task('images', () => {
    return gulp.src("app/img/*.*")
        .pipe(gulp.dest("dist/img/"))
        .pipe(browserSync.stream());
});
gulp.task('fonts', () => {
    return gulp.src("app/fonts/*.*")
        .pipe(gulp.dest("dist/fonts/"))
        .pipe(browserSync.stream());
});
gulp.task('serve', function(done) {

    browserSync.init({
        server: dist
    });

    gulp.watch("app/sass/*.s*ss", gulp.series('sass'));
    gulp.watch("app/sass/blocks/*.s*ss", gulp.series('sass'));
    gulp.watch("app/js/*.js", gulp.series('build-js'));
    gulp.watch("app/js/*/*.js", gulp.series('build-js'));
    gulp.watch("app/*.html", gulp.series('html'));
    gulp.watch("app/img/**/*.*", gulp.series('images'));
    // gulp.watch("app/*.*").on('change', () => {
    //   browserSync.reload();
    //   done();
    // });
    done();
});

gulp.task('default', gulp.series('sass', 'html', 'fonts','images' ,'build-js','serve'));
gulp.task('noJs', gulp.series('sass', 'html' , 'fonts', 'images','serve'));