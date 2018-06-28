var gulp = require("gulp");
var chug = require("gulp-chug");
var runSequence = require("run-sequence");

// Launch task of other gulp files to build and generate documentation with one single command

gulp.task("typedoc:core", function(done) {
  console.log("--- Start => TYPEDOC SERVER ---");
  gulp.src("./core/gulpfile.js").pipe(
    chug(
      {
        nodeCmd: "node",
        tasks: ["typedoc"]
      },
      () => {
        console.log("--- End => TYPEDOC SERVER ---");
        done();
      }
    )
  );
});

gulp.task("build:client", function(done) {
  console.log("--- Start => BUILD CLIENT ---");
  gulp.src("./client/gulpfile.js").pipe(
    chug(
      {
        nodeCmd: "node",
        tasks: ["default"]
      },
      () => {
        console.log("--- End => BUILD CLIENT ---");
        done();
      }
    )
  );
});

gulp.task("build:server", function(done) {
  console.log("--- Start => BUILD SERVER ---");
  gulp.src("./server/gulpfile.js").pipe(
    chug(
      {
        nodeCmd: "node",
        tasks: ["default"]
      },
      () => {
        console.log("--- End => BUILD SERVER ---");
        done();
      }
    )
  );
});

gulp.task(
  "default",
  runSequence("build:client", "build:server", "typedoc:core")
);
