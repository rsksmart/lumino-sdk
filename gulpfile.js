const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const jsdoc = require('gulp-jsdoc3');
const connect = require('gulp-connect');
const webpack = require('webpack-stream');
const del = require('del');

gulp.task('default', () => {
    gulp.start('lint', 'babel', 'doc');
});

gulp.task('clean', () => {
    return del([
        'dist',
        'samplesBuild',
        'docs',
        'coverage'
    ]);
});

gulp.task('lint', () => {
    return gulp
        .src(['src/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('watch', () => {
    gulp.watch(['src/**/*.js', 'src/*.js', 'samples/**'], gulp.series('bundle', 'developBuild'));
});

gulp.task('babel', gulp.series('clean', done => {
    gulp
        .src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/env'],
                plugins: [
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/plugin-transform-runtime',
                    '@babel/plugin-transform-modules-commonjs',
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-syntax-optional-chaining',
                ],
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(connect.reload())
        .pipe(gulp.dest('dist'));
    done();
}));

gulp.task('bundle', () => {
    return gulp.src('src/index.js')
        .pipe(webpack({
                mode: 'production',
                output: {
                    filename: 'bundle.js',
                    path: __dirname + '/dist',
                    library: 'Lumino',
                    libraryTarget: 'global',
                    libraryExport: 'default'
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                    plugins: [
                                        '@babel/plugin-proposal-object-rest-spread',
                                        '@babel/plugin-transform-runtime',
                                        '@babel/plugin-transform-modules-commonjs',
                                        '@babel/plugin-syntax-dynamic-import',
                                        '@babel/plugin-syntax-optional-chaining',
                                    ],
                                }
                            },
                        },
                        {
                            test: /\.json$/,
                            use: {
                                loader: 'json-loader'
                            },
                        },
                    ],
                }
            }))
        .pipe(connect.reload())
        .pipe(gulp.dest('dist/'));
});

gulp.task('generateDoc', cb => {
    gulp.src(['README.md', 'src/**/*.js'], { read: false }).pipe(jsdoc(cb));
});

gulp.task('docServer', () => {
    connect.server({
        port: 8085,
        root: 'docs/gen'
    });
});

gulp.task('doc', gulp.series('generateDoc', 'docServer'));

gulp.task('developServer', () => {
    connect.server({
        port: 8085,
        root: 'samplesBuild',
        livereload: true
    });
});

gulp.task('generateSamples', () => {
    return gulp.src(['dist/*.js', 'samples/**', 'setup.json']).pipe(gulp.dest('samplesBuild'));
});

gulp.task('developBuild', gulp.series('clean', 'bundle', 'generateSamples'));

gulp.task('develop', gulp.parallel('developBuild', 'developServer', 'watch'));
