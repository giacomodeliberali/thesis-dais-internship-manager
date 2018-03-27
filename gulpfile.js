var gulp = require("gulp");
var typedoc = require("gulp-typedoc");
var exec = require('child_process').exec;
var gulpSequence = require('gulp-sequence');

gulp.task("typedoc", function () {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "./docs",
            mode: "file",
            name: "Thesis - Core",
            lib: [
                "lib.es2017.d.ts",
                "lib.dom.d.ts"
            ],
            readme: "./readme.md"
        }));
});

gulp.task('copy-package-json', function () {
    return gulp.src('package.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (cb) => {
    return exec('tsc', (err, stdout, stderr) => {
        if (err)
            console.log(err);
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('default', function (cb) {
    gulpSequence('build', 'copy-package-json', 'typedoc', cb);
});