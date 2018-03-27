var gulp = require("gulp");
var typedoc = require("gulp-typedoc");

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

gulp.task('default', ['typedoc']);