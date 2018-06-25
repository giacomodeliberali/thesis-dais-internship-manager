var gulp = require('gulp');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var typedoc = require("gulp-typedoc");
var gulpSequence = require('gulp-sequence');

const repositoryName = "thesis-dais-internship-manager";
const outPath = "../docs";

gulp.task('build-docs', function (cb) {
    return exec(`ng build --prod --output-path ${outPath} --base-href /${repositoryName}/`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('copy-index', function () {
    return gulp.src(`${outPath}/index.html`)
        .pipe(rename('404.html'))
        .pipe(gulp.dest(outPath));
});

gulp.task("typedoc", function () {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es",
            out: `${outPath}/dev-docs/client`,
            mode: "file",
            name: "DAIS Internship Manager - Client",
            lib: [
                "lib.es2016.d.ts",
                "lib.dom.d.ts"
            ],
            readme: "./readme.md",
            experimentalDecorators: true,
            ignoreCompilerErrors: true
        }));
});


gulp.task('default', function (cb) {
    gulpSequence('build-docs', 'copy-index', 'typedoc', cb)
});