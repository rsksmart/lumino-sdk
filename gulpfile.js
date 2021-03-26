const gulp = require("gulp");
const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const jsdoc = require("gulp-jsdoc3");
const connect = require("gulp-connect");

gulp.task("default", () => {
    gulp.start("lint", "babel", "doc");
});

gulp.task("lint", () => {
    return gulp
        .src(["src/*.js", "!node_modules/**"])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task("watch", () => {
    gulp.watch(["src/**/*.js", "samples/**/*.js", "samples/**/*.html"], gulp.series("babel"));
});

gulp.task("babel", done => {
    gulp
        .src("src/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ["@babel/env"],
                plugins: [
                    "@babel/plugin-proposal-object-rest-spread",
                    "@babel/plugin-transform-runtime",
                    "@babel/plugin-transform-modules-commonjs",
                    "@babel/plugin-syntax-dynamic-import",
                    "@babel/plugin-syntax-optional-chaining",
                ],
            })
        )
        .pipe(sourcemaps.write("."))
        .pipe(connect.reload())
        .pipe(gulp.dest("dist"));
    done();
});

gulp.task("generateDoc", cb => {
    gulp.src(["README.md", "src/**/*.js"], { read: false }).pipe(jsdoc(cb));
});

gulp.task("docServer", () => {
    connect.server({
        port: 8085,
        root: 'docs/gen'
    });
});

gulp.task("doc", gulp.series("generateDoc", "docServer"));

gulp.task("developServer", () => {
    connect.server({
        port: 8085,
        root: 'samples',
        livereload: true
    });
});

gulp.task("develop", gulp.parallel("babel", "developServer", "watch"));
