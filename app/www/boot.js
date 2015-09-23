"use strict";

$script("js/app.js", "app");
$script.ready("app", function () {
    var locale = window.localStorage.getItem("user.locale") || window.localStorage.getItem("user.language") || "en";
    $script("js/i18n/angular-locale_" + locale + ".js");
});
