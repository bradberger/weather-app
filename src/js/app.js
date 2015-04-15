"use strict";

Number.isNaN = Number.isNaN || function (value) {
    return typeof value === "number" && isNaN(value);
};

Number.roundTo = function (num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
};

function getTelemetryStatus() {
    var telemetry = window.localStorage.getItem("user.telemetry");
    return !!(telemetry === null || !!telemetry);
}

angular.module("weatherApp", ["ngMaterial", "ngRoute", "ngAnimate", "ngLocale", "angular.translate", "ionic"])
    .config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {

        $mdThemingProvider.theme("default")
            .primaryPalette("blue")
            .accentPalette("light-blue");

        $routeProvider
            .when("/home", {
                templateUrl: "views/home.html",
                controller: "HomeCtrl"
            })
            .when("/locations", {
                templateUrl: "views/locations.html",
                controller: "LocationsCtrl"
            })
            .when("/locate", {
                templateUrl: "views/locate.html",
                controller: "LocateCtrl"
            })
            .when("/weather/:latitude/:longitude", {
                templateUrl: "views/weather.html",
                controller: "WeatherCtrl"
            })
            .when("/settings", {
                templateUrl: "views/settings.html",
                controller: "SettingsCtrl"
            })
            .when("/feedback", {
                templateUrl: "views/feedback.html",
                controller: "FeedbackCtrl"
            })
            .otherwise({
                redirectTo: "/home"
            });

    }])
    .run(["$rootScope", "$mdDialog", "$window", "$timeout", "Language", "FirefoxPushNotifications", "$ionicPlatform", "$location",
        function ($rootScope, $mdDialog, $window, $timeout, Language, FirefoxPushNotifications, $ionicPlatform, $location) {

            $rootScope.language = new Language();

            // Use this to correct units.
            var units = $window.localStorage.getItem("user.units");
            if (units === "metric") {
                $window.localStorage.setItem("user.units", "us");
            } else if (units === "imperial") {
                $window.localStorage.setItem("user.units", "ca");
            }

            $rootScope.getLanguage = function () {
                return (
                    $window.localStorage.getItem("user.language") ||
                    $window.navigator.language ||
                    "en"
                ).split("-")[0];
            };

            $rootScope.telemetry = getTelemetryStatus();
            $rootScope.version = "0.1.7";
            $rootScope.versions = {
                "0.1.7": ["Improved navigation", "Improved performance", "Updated icons", "Bug fixes"]
            };

            $rootScope.versionAlert = function (force) {
                force = force || false;
                angular.forEach($rootScope.versions, function (changes, version) {
                    if (version === $rootScope.version) {
                        if (force || !$window.localStorage.getItem("alerts.version." + $rootScope.version)) {
                            $mdDialog.show({
                                templateUrl: "templates/version.html",
                                controller: ["$scope", "$mdDialog", function ($scope, $mdDialog) {
                                    $scope.language = $rootScope.language;
                                    $scope.version = version;
                                    $scope.changes = changes;
                                    $scope.done = function () {
                                        $mdDialog.hide(true);
                                    };
                                }]
                            }).then(function () {
                                $window.localStorage.setItem("alerts.version." + $rootScope.version, "1");
                            });
                        }
                    }
                });
            };

            var history = [];

            $rootScope.$on("$routeChangeSuccess", function() {

                var url = $location.url();

                // Don't add the previous entry.
                if (history.length && history[history.length - 1] !== url) {
                    history.push(url);
                }

                // Store the last view.
                $window.localStorage.setItem("user.view", url);

                // Show back button if not home.
                $rootScope.showBack = url !== "/home";

            });

            $rootScope.back = function() {
                var newUrl = "/home";
                if (history.length > 1) {
                    newUrl = history[history.length - 2];
                    history.splice(history.length - 1, 1);
                }
                $location.url(newUrl);
            };

            $window.user = $rootScope.user = { subscriptions: false, charges: false, paid: false };
            $rootScope.setUserPaymentStatus = function() {

                var user = { subscriptions: false, charges: false, paid: false };
                var subscriptions = $window.localStorage.getItem("user.subscriptions");
                var charges = $window.localStorage.getItem("user.charges");

                if (subscriptions) {
                    user.subscriptions = angular.fromJson(subscriptions);
                }

                if (charges) {
                    user.charges = angular.fromJson(charges);
                }

                user.paid = !! (user.charges || user.subscriptions);

                $window.user = $rootScope.user = angular.copy(user);

            };

            $rootScope.scrollTo = function (x, y) {
                $window.scrollTo(x || 0, y || 0);
            };

            $rootScope.online = !!$window.navigator.onLine;

            $rootScope.push = {
                regs: null
            };

            var notifications = new FirefoxPushNotifications();
            $ionicPlatform.ready(function() {

                var lastView =$window.localStorage.getItem("user.view");
                if (lastView) {
                    $location.url(lastView);
                }

                // Check error/telemetry settings and disable if not desired
                $timeout($rootScope.versionAlert, 1000);
                $window.addEventListener("online", function () {

                    var online = !! navigator.onLine,
                        now = new Date();

                    $rootScope.online = online;
                    if (online) {
                        $rootScope.$broadcast("online", now);
                    } else {
                        $rootScope.$broadcast("offline", now);
                    }

                });

                $ionicPlatform.onHardwareBackButton(function () {
                    $rootScope.back();
                });

                $rootScope.setUserPaymentStatus();
                $rootScope.$on("user.account.update", $rootScope.setUserPaymentStatus());

                notifications.init();

            });



        }]);
