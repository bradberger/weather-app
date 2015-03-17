/* globals __dirname: false */

"use strict";

require("events").EventEmitter.prototype._maxListeners = 200;

function getVersion(skipTimestamp) {

    var version = require(opts.path("bower.json")).version;
    if (skipTimestamp || false) {
        return version;
    }

    return [
        version,
        getTimestamp()
    ].join(".");

}

function getTimestamp(date) {
    date = date || new Date();
    return Math.round(date.valueOf() / 1000);
}

function getZipName(platform) {

    return [
        "weather-app",
        platform || "firefox",
        getVersion(),
        "zip"
    ].join(".");

}

var gulp = require("gulp"),
    manifest = require("gulp-manifest"),
    webserver = require("gulp-webserver"),
    uglify = require("gulp-uglify"),
    changed = require("gulp-changed"),
    minifyCSS = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    imagemin = require("gulp-imagemin"),
    autoprefixer = require("gulp-autoprefixer"),
    jshint = require("gulp-jshint"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
    minifyHTML = require("gulp-minify-html"),
    glob = require("glob"),
    replace = require("gulp-replace"),
    runSequence = require("run-sequence"),
    shell = require("gulp-shell"),
    opts = {
        path: function(path) {
            return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
        },
        uncss: { html: glob.sync("app/www/**/*.html") },
        html: { empty: true, quotes: true, spare: true },
        autoprefixer: { browsers: ["last 2 versions"], cascade: true },
        css: { keepBreaks: false },
        clean: {force: true},
        webserver: {
            livereload: true,
            directoryListing: false,
            open: false,
            fallback: "index.html"
        }
    };


var configXML = opts.path("app");
var CSS_DEST = opts.path("app/www/css");
var CSS_SRC = [
    opts.path("src/components/nvd3/build/nv.d3.min.css"),
    opts.path("src/components/gaia-fonts/style.css"),
    opts.path("src/components/weather-icons/css/weather-icons.css"),
    opts.path("src/components/angular/angular-csp.css"),
    opts.path("src/components/angular-material/angular-material.css"),
    opts.path("src/css/app.css")
];
var JS_DEST = opts.path("app/www/js");
var JS_SRC = [
    opts.path("src/components/d3/d3.min.js"),
    opts.path("src/components/nvd3/build/nv.d3.min.js"),
    opts.path("src/components/monetizejs/dist/monetize.min.js"),
    opts.path("src/components/fastclick/lib/fastclick.js"),
    opts.path("src/components/angular/angular.min.js"),
    opts.path("src/components/angular-route/angular-route.min.js"),
    opts.path("src/components/angular-animate/angular-animate.min.js"),
    opts.path("src/components/angular-sanitize/angular-sanitize.min.js"),
    opts.path("src/components/angular-touch/angular-touch.min.js"),
    opts.path("src/components/angular-aria/angular-aria.min.js"),
    opts.path("src/components/angular-material/angular-material.min.js"),
    opts.path("src/components/angular-translatability/angular-translate.min.js"),
    opts.path("src/components/angulartics/dist/angulartics.min.js"),
    opts.path("src/components/angulartics/dist/angulartics-piwik.min.js"),
    opts.path("src/js/app.js"),
    opts.path("src/js/directives/*.js"),
    opts.path("src/js/services/*.js"),
    opts.path("src/js/filters/*.js"),
    opts.path("src/js/controllers/*.js")
];

gulp.task("jshint", function () {
    return gulp.src("src/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("jshint:fail", function () {
    return gulp.src("src/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("images", function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("app/www/img"));
});

gulp.task("jade", function () {

    var DEST = opts.path("src/html"),
        SRC = opts.path("src/jade/**/*.jade");

    return gulp.src(SRC)
        .pipe(jade())
        .pipe(gulp.dest(DEST));
});

gulp.task("html", function() {

    var SRC = opts.path("src/html/**/*.html"),
        DEST = opts.path("app/www");

    return gulp.src(SRC)
        .pipe(changed(DEST))
        .pipe(minifyHTML(opts.html))
        .pipe(gulp.dest(DEST));
});

gulp.task("sass", function() {

    var SRC = opts.path("src/sass/**/*.scss"),
        DEST = opts.path("src/css");

    return gulp.src(SRC)
        .pipe(sass())
        .pipe(gulp.dest(DEST));
});

gulp.task("assets:build", function() {

    var SRC = opts.path("src/assets/**/*"),
        DEST = opts.path("app/www");

    return gulp.src(SRC)
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST));

});

gulp.task("assets:manifest", function() {
    gulp.src([
        opts.path("app/www/**/*"),
        opts.path("app/www/css/**/*"),
        opts.path("app/www/img/**/*"),
        opts.path("app/www/fonts/**/*"),
        opts.path("app/www/font/**/*"),
        opts.path("app/www/languages/**/*"),
        opts.path("app/www/templates/**/*"),
        opts.path("app/www/views/**/*")
    ])
        .pipe(manifest({
            hash: true,
            network: ["http://*", "https://*", "*"],
            filename: "manifest.appcache",
            exclude: "manifest.appcache"
        }))
        .pipe(gulp.dest(opts.path("app/www")));
});

gulp.task("assets", function() {
    return runSequence("assets:build", "assets:manifest");
});

gulp.task("css:build", function() {
    return gulp.src(CSS_SRC)
        .pipe(concat("app.css"))
        .pipe(autoprefixer(opts.autoprefixer))
        .pipe(minifyCSS(opts.css))
        .pipe(gulp.dest(CSS_DEST));
});

gulp.task("css:dev", function() {
    return gulp.src(CSS_SRC)
        .pipe(concat("app.css"))
        .pipe(gulp.dest(CSS_DEST));
});

gulp.task("js:dev", ["jshint"], function() {

    return gulp.src(JS_SRC)
        .pipe(concat("app.js"))
        .pipe(gulp.dest(JS_DEST));

});

gulp.task("js:build", ["jshint:fail"], function() {

    return gulp.src(JS_SRC)
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(gulp.dest(JS_DEST));

});

gulp.task("webserver", function() {
    return gulp.src(opts.path("app/www"))
        .pipe(webserver(opts.webserver));
});

gulp.task("test", ["jshint:fail"]);

gulp.task("watch", ["webserver"], function () {
    gulp.watch(["src/html/**/*.html"], function() {
        runSequence("html");
    });
    gulp.watch(["src/css/**/*.css"], ["css:dev"]);
    gulp.watch(["src/sass/app.scss"], ["sass"]);
    gulp.watch(["src/jade/**/*.jade"], ["jade"]);
    gulp.watch(["src/js/**/*.js"], ["js:dev"]);
    gulp.watch(["src/img/**/*"], ["images"]);
    gulp.watch(["src/assets/**/*"], ["assets"]);
    gulp.watch(["src/www/**/*"], ["build:firefox"]);
});

// Note that Blackberry doesn't support x.x.x.XXXX just x.x.x
gulp.task("build:version", function() {
    gulp.src(configXML + "/config.xml")
        .pipe(replace(/^(\<[^\?]+version=['"]+)[0-9\.]+(['"]+)/gmi, "$1" + getVersion() + "$2"))
        .pipe(gulp.dest(configXML));

});

gulp.task("build:version:blackberry", function() {
    console.info(getVersion(true));
    gulp.src(configXML + "/config.xml")
        .pipe(replace(/^(\<[^\?]+version=['"]+)[0-9\.]+(['"]+)/gmi, "$1" + getVersion(true) + "$2"))
        .pipe(gulp.dest(configXML));
});

gulp.task("build:fonts", shell.task([
    "cp src/components/gaia-fonts/fonts/* app/www/fonts",
    "cp src/components/fontawesome/fonts/* app/www/fonts",
    "cp src/components/weather-icons/font/* app/www/font",
    "cp src/components/roboto-fontface/fonts/* app/www/fonts"
]));

gulp.task("build:blackberry", ["build:version:blackberry"], shell.task([
    "cd app && cordova build blackberry10"
]));

gulp.task("build:firefox", ["build:version"], shell.task([
    "cd app && cordova build firefoxos"
]));

gulp.task("build:ubuntu", ["build:version"], shell.task([
    "cd app && cordova build ubuntu",
    "cd app/platforms/ubuntu/native/com.bitola.weather && debuild",
    "cp app/platforms/ubuntu/native/*.deb build/ubuntu"
]));

gulp.task("package:firefox", ["build:version", "build:fonts"], shell.task([
    "gulp build",
    "gulp test",
    "cp app/www/manifest.webapp app/platforms/firefoxos/platform_www",
    "cp app/www/img/icon-*.png app/platforms/firefoxos/platform_www/icon",
    "cd app && cordova build firefoxos",
    "rm app/platforms/firefoxos/www/manifest.appcache",
    "rm app/platforms/firefoxos/www/cordova.js",
    "rm app/platforms/firefoxos/www/cordova_plugins.js",
    "rm app/platforms/firefoxos/www/offline.html",
    "rm app/platforms/firefoxos/www/robots.txt",
    "rm app/platforms/firefoxos/www/humans.txt",
    "rm app/platforms/firefoxos/www/favicon.ico",
    "rm app/platforms/firefoxos/www/js/index.js",
    "rm app/platforms/firefoxos/www/css/index.css",
    "rm app/platforms/firefoxos/www/fonts/FiraSans-*",
    "rm app/platforms/firefoxos/www/fonts/Roboto-*",
    "rm app/platforms/firefoxos/www/font/Roboto-*",
    "rm app/platforms/firefoxos/www/apple-touch-icon-precomposed.png",
    "cd app/platforms/firefoxos/www && zip -r ../../../../build/firefox/" + getZipName("firefox") + " *"
]));

gulp.task("build", function() {
    return runSequence(["sass", "jade", "js:build", "images"], "html", ["css:build"], ["assets"]);
});

gulp.task("default", function() {
    runSequence("watch");
});
