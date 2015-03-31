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
    imageResize = require("gulp-image-resize"),
    parallel = require("concurrent-transform"),
    os = require("os"),
    autoprefixer = require("gulp-autoprefixer"),
    jshint = require("gulp-jshint"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
    rename = require("gulp-rename"),
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
    //opts.path("src/components/d3/d3.min.js"),
    //opts.path("src/components/nvd3/build/nv.d3.min.js"),
    opts.path("src/components/monetizejs/dist/monetize.min.js"),
    opts.path("src/components/angular/angular.min.js"),
    opts.path("src/components/angular-route/angular-route.min.js"),
    opts.path("src/components/angular-animate/angular-animate.min.js"),
    //opts.path("src/components/angular-sanitize/angular-sanitize.min.js"),
    opts.path("src/components/angular-touch/angular-touch.min.js"),
    opts.path("src/components/angular-aria/angular-aria.min.js"),
    opts.path("src/components/angular-material/angular-material.min.js"),
    opts.path("src/components/angular-translatability/angular-translate.min.js"),
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

gulp.task("images", ["images:icons", "images:splash"], function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("app/www/img"));
});

gulp.task("images:icons", function() {

    var sizes = [29, 30, 36, 48, 57, 58, 60, 62, 64, 72, 76, 78, 90, 96, 99, 114, 120, 128, 144, 152, 173, 180, 192, 200, 256, 320, 512, 1024];
    sizes.forEach(function(size) {

        gulp.src("src/img/icons/icon.png")
            .pipe(imageResize({
                width: size
            }))
            .pipe(rename(size.toString() + ".png"))
            .pipe(gulp.dest("src/img/icons"));

    });

});

gulp.task("images:splash", function() {

    var sizes = [
        { w: 64, h: 64 },
        { w: 86, h: 86 },
        { w: 150, h: 150 },
        { w: 200, h: 320 },
        { w: 250, h: 250 },
        { w: 240, h: 400 },
        { w: 320, h: 480 },
        { w: 480, h: 800 },
        { w: 720, h: 1280 },
        { w: 768, h: 1024 },
        { w: 640, h: 960 },
        { w: 640, h: 1136 },
        { w: 640, h: 1146 },
        { w: 750, h: 1334 },
        { w: 800, h: 1000 },
        { w: 1242, h: 2208 }
    ];

    var orig = opts.path("src/img/splash/splash.png");

    sizes.forEach(function(size) {

        gulp.src(orig)
            .pipe(imageResize({
                width: size.w,
                height: size.h,
                format: "png",
                crop: true
            }))
            .pipe(rename(size.w + "x" + size.h + ".png"))
            .pipe(gulp.dest(opts.path("src/img/splash")));

        // Portrait
        gulp.src(orig)
            .pipe(imageResize({
                width: size.h,
                height: size.w,
                crop: true
            }))
            .pipe(rename(size.h + "x" + size.w + ".png"))
            .pipe(gulp.dest("src/img/splash"));

        // 2x landscape
        gulp.src(orig)
            .pipe(imageResize({
                width: size.w * 2,
                height: size.h * 2,
                crop: true
            }))
            .pipe(rename(size.w + "x" + size.h + "@2x.png"))
            .pipe(gulp.dest("src/img/splash"));

        // 2x portrait
        gulp.src(orig)
            .pipe(imageResize({
                width: size.h * 2,
                height: size.w * 2,
                crop: true
            }))
            .pipe(rename(size.h + "x" + size.w + "@2x.png"))
            .pipe(gulp.dest("src/img/splash"));


    });

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

    var SRC = opts.path("src/sass/app.scss"),
        DEST = opts.path("src/css");

    return gulp.src(SRC)
        .on("error", function(err) {
            console.error(err);
        })
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
    gulp.watch(["src/sass/**/*.scss"], ["sass"]);
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
    "cp src/components/weather-icons/font/* app/www/font",
    "cp src/components/fontawesome/fonts/* src/assets/font/font-awesome"
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
    "cd app && cordova build firefoxos",
    "rm app/platforms/firefoxos/www/manifest.appcache",
    "rm app/platforms/firefoxos/www/cordova.js",
    "rm app/platforms/firefoxos/www/cordova_plugins.js",
    "rm app/platforms/firefoxos/www/manifest.json",
    "rm app/platforms/firefoxos/www/offline.html",
    "rm app/platforms/firefoxos/www/robots.txt",
    "rm app/platforms/firefoxos/www/humans.txt",
    "rm app/platforms/firefoxos/www/favicon.ico",
    "rm app/platforms/firefoxos/www/js/index.js",
    "rm app/platforms/firefoxos/www/manifest.mobile.json",
    "rm app/platforms/firefoxos/www/apple-touch-icon-precomposed.png",
    "rm app/platforms/firefoxos/build/*.zip",
    "cd app/platforms/firefoxos/www && zip -r ../../../../build/firefox/" + getZipName("firefox") + " *"
]));

gulp.task("build", function() {
    return runSequence(["sass", "jade", "js:build", "images"], "html", ["css:build"], ["assets"]);
});

gulp.task("default", function() {
    runSequence("watch");
});
