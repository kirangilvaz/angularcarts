// Import gulp & plugins
var gulp = require("gulp");
var clean = require("gulp-clean");
var uglify = require("gulp-uglify");
var minifyCSS = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var csslint = require("gulp-csslint");
var newer = require("gulp-newer");
var gulpif = require("gulp-if");
var karma = require("gulp-karma");
var eventStream = require("event-stream");
var runSequence = require("run-sequence"); // this should be temporary until gulp supports sequencing
var connect = require("gulp-connect");
var html2js = require("gulp-ng-html2js");
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');
// file paths
var srcHtml = ["src/index.html"];
var srcHtmlTemplates = ["src/**/*.html", "!src/index.html"];
var srcSass = ["src/**/*.scss"];
var srcJs = ["src/**/*.module.js", "src/**/*.js", "!src/**/*.test.js"];
var srcL10n = "src/l10n/*.json";
var distDirectory = "dist";
var vendorDistDirectory = distDirectory + "/vendor";
var vendorSrcJs = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/jquery-ui/jquery-ui.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.js",
    "bower_components/angular/angular.min.js",
    "bower_components/angular-animate/angular-animate.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "bower_components/angular-translate/angular-translate.min.js",
    "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
    "bower_components/angular-sanitize/angular-sanitize.min.js",
    "node_modules/eventsource/example/eventsource-polyfill.js",
    "bower_components/ui-router/release/angular-ui-router.min.js",
    "bower_components/angular-modal-service/dst/angular-modal-service.js"
];
var vendorSrcCss = [
    "bower_components/bootstrap/dist/css/bootstrap.min.css",
    "bower_components/jquery-ui/themes/smoothness/jquery-ui.css"];
var imgDirectory = ["src/images/*","src/images/**/*.*"];
// some global properties
var isProd = false;
// Tasks
gulp.task("default", ["watch"]);
gulp.task("watch", ["build-dev"], function() {
    gulp.watch(srcHtml, ["html"]);
    gulp.watch(srcHtmlTemplates, ["html-templates"]);
    gulp.watch(srcSass, ["sass"]);
    gulp.watch(srcJs, ["js"]);
    gulp.watch(imgDirectory, ["img"]);
    gulp.watch(srcL10n, ["i18n"]);
});
// NOTE: inject-favixon-markups runs html as a dependency
gulp.task("build-dev", ["inject-favicon-markups", "html-templates", "vendor", "sass", "js", "img", "i18n"]);
gulp.task("build-prod", function(callback) {
    isProd = true;
    runSequence("clean", "build-dev", callback);
});
gulp.task("clean", function() {
    return gulp.src(distDirectory, { read: false })
        .pipe(clean());
});
gulp.task("html", function() {
    return compileHtml(srcHtml, distDirectory);
});
gulp.task("html-templates", function() {
    return gulp.src(srcHtmlTemplates)
        .pipe(minifyHTML({
            empty: true,
            quotes: true,
            comments: true,
            spare: true
        }))
        .pipe(html2js({
            moduleName: "x1.ubx.templates"
        }))
        .pipe(concat("templates.js"))
        .pipe(uglify())
        .pipe(gulp.dest(distDirectory));
});
gulp.task("sass", function() {
    return compileSass(srcSass, distDirectory, "app.css");
});
gulp.task("js", function() {
    return compileJs(srcJs, distDirectory, "app.js", "../../src", true);
});
gulp.task("img", function() {
    return gulp.src(imgDirectory)
        .pipe(gulp.dest(distDirectory + "/images"));
});
gulp.task("vendor", function() {
    return eventStream.merge(
        compileCss(vendorSrcCss, vendorDistDirectory, "vendor.css", false),
        compileJs(vendorSrcJs, vendorDistDirectory, "vendor.js", false)
    );
});
gulp.task("test", function() {
    // to get files in karma.conf.js recognized, passing in
    // non-existent dir (from https://github.com/lazd/gulp-karma/issues/9)
    return gulp.src("./badpath")
        .pipe(karma({
            configFile: "karma.conf.js",
            action: "run"
        }));
});
gulp.task("i18n", function() {
    return gulp.src(srcL10n)
        .pipe(gulp.dest(distDirectory + "/l10n"));
});
//common functions
function compileHtml(source, destination) {
    return gulp.src(source)
        .pipe(newer(distDirectory))
        .pipe(gulpif(isProd, minifyHTML({empty: true, spare: true})))
        .pipe(gulp.dest(destination));
}
function compileCss(source, destination, concatName, hideErrors) {
    return gulp.src(source)
        .pipe(csslint("csslintrc.json"))
        .pipe(gulpif(hideErrors, csslint.reporter()))
        .pipe(gulpif(isProd, minifyCSS()))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}
function compileSass(source, destination, concatName, hideErrors) {
    return gulp.src(source)
        .pipe(sass())
        .pipe(csslint("csslintrc.json"))
        .pipe(gulpif(hideErrors, csslint.reporter()))
        .pipe(gulpif(isProd, minifyCSS()))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}
function compileJs(source, destination, concatName, hideErrors) {
    return gulp.src(source)
        .pipe(jshint())
        .pipe(gulpif(hideErrors, jshint.reporter("default")))
        .pipe(concat(concatName))
        .pipe(gulpif(isProd, uglify({mangle: false})))
        .pipe(gulp.dest(destination));
}
//a server, for convenience
gulp.task("distServer", ["server"]);
gulp.task('server', function () {
    connect.server({
        root: distDirectory,
        port: 1882,
        livereload: true
    });
    // excluding test subdirectory to prevent refreshing again once the test have completed
    gulp.watch([
        distDirectory + '/*.html',
        distDirectory + '/*.js',
        distDirectory + '/*.css',
        distDirectory + '/(!test)/**/*.html',
        distDirectory + '/(!test)/**/*.js',
        distDirectory + '/(!test)/**/*.css',
        distDirectory + '/(!test)/**/*.json'
    ], function() {
        gulp.src(distDirectory).pipe(connect.reload());
    });
});
// single task for development: start webserver and watch for changes
gulp.task('dev', ['server', 'watch']);
// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'favicon.json';
// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'src/images/favicon.png',
        dest: 'dist',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#603cba',
                onConflict: 'override'
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#734098',
                manifest: {
                    name: 'Test Drive',
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 76.5625,
                themeColor: '#734098'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        versioning: {
            paramName: 'v',
            paramValue: 'jwwPd89pyl'
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});
// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', ["html", "generate-favicon"], function() {
    gulp.src([ 'dist/*.html' ])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('dist'));
});
// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});