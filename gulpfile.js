var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var tsProject = ts.createProject("tsconfig.json");
var typedoc = require("gulp-typedoc");

gulp.task("tslint", () =>
    gulp.src('src/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report())
);

gulp.task("build", ["tslint"], () => {
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});


gulp.task("typedoc", function () {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "es6",
            out: "docs",
            mode: "file",
            name: "Thesis - Server",
            readme: "./readme.md",
            experimentalDecorators: true
        }));
});

gulp.task("default", ["build"]);