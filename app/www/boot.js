"use strict";


$script("js/app.js", "app");
$script.ready("app", function () {
    var locale = window.localStorage.getItem("user.locale") || window.localStorage.getItem("user.language") || "en";
    $script("js/i18n/angular-locale_" + locale + ".js", function () {
        // We bootstrap manually to make sure the locales get used.
        angular.element(document).ready(function () {
            angular.bootstrap(document, ["weatherApp"]);
        });
    });
});