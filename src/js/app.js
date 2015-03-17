"use strict";

Number.isNaN = Number.isNaN || function(value) {
    return typeof value === "number" && isNaN(value);
};

angular.module("ngMonetize", [])
    .service("Monetize", ["$window", "$q", "$http", "$log", function($window, $q, $http, $log) {

        function Monetize(appId) {

            var self = this;

            this.appId = appId || false;
            this.debug = true;
            this.payments = false;
            this.error = false;
            this.token = false;
            this.monetize = false;

            this.init = function() {

                var err, deferred = $q.defer();

                if("undefined" === typeof MonetizeJS) {
                    err = "MonetizeJS client library is not included.";
                    deferred.reject(err);
                    if (self.debug) {
                        $log.error(err);
                    }
                } else {

                    if (! self.appId) {
                        err = "No MonetizeJS app id was provided";
                        deferred.reject(err);
                        if (self.debug) {
                            $log.error(err);
                        }
                    } else {
                        self.monetize = new MonetizeJS({
                            applicationID: self.appId
                        });
                        deferred.resolve(self.monetize);
                    }

                }

                return deferred.promise;

            };

            this.getTokenImmediate = function(options) {

                var deferred = $q.defer();

                if (! self.monetize) {
                    deferred.reject("Monetize library not initialized");
                    return deferred.promise;
                }

                self.monetize.getTokenImmediate(options || null, function(err, token) {
                    if (err) {
                        self.token = false;
                        self.error = err;
                        deferred.reject(err);
                        if (self.debug) {
                            $log.error("monetize.getTokenInteractive", err);
                        }
                    } else if(token) {
                        self.token = token;
                        self.error = false;
                        deferred.resolve(token);
                        if (self.debug) {
                            $log.info("monetize.getTokenInteractive", token);
                        }
                    }
                });

                return deferred.promise;

            };

            /**
             * Perform a redirection to the MonetizeJS platform for sign in and/or payment
             * and get an access token as a result.
             *
             * @see https://github.com/monetizejs/monetize.js
             * @param options
             * @param onSuccess
             * @param onError
             * @returns {*}
             */
            this.getTokenInteractive = function(options, onSuccess, onError) {

                var deferred = $q.defer();

                if (! self.monetize) {
                    deferred.reject("Monetize library not initialized");
                    return deferred.promise;
                }

                // Use the callback. Easier and cleaner.
                if(onSuccess || onError || false) {

                    self.monetize.getTokenInteractive(options || null, function(err, token) {
                        if (err) {
                            self.token = false;
                            self.error = err;
                            deferred.reject(err);
                            if (self.debug) {
                                $log.error("monetize.getTokenInteractive", err);
                            }
                            if("function" === typeof onSuccess) {
                                onError();
                            }
                        } else if(token) {
                            self.token = token;
                            self.error = false;
                            deferred.resolve(token);
                            if (self.debug) {
                                $log.info("monetize.getTokenInteractive", token);
                            }
                            if("function" === typeof onSuccess) {
                                onSuccess();
                            }
                        }
                    });

                } else {

                    // This redirects in-page, so there's no need to finish with the promise,
                    // as the user is going to be send away from the page anyways.
                    self.monetize.getTokenInteractive(options);

                }



                return deferred.promise;

            };

            this.getPaymentsImmediate = function() {

                var deferred = $q.defer();

                if (! self.monetize) {
                    deferred.reject("Monetize library not initialized");
                    return deferred.promise;
                }

                self.monetize.getPaymentsImmediate(function(err, payments) {
                    if (payments) {
                        self.payments = payments;
                        deferred.resolve(payments);
                        if (self.debug) {
                            $log.debug("monetize.getPaymentsImmediate", payments);
                        }
                    } else {
                        self.payments = false;
                        self.err = err;
                        deferred.reject(err);
                        if (self.debug) {
                            $log.error("monetize.getPaymentsImmediate", err);
                        }
                    }
                });

                return deferred.promise;

            };


            /**
             * Wrapper for MonetizeJS.getPaymentsInteractive.
             * Perform a redirection to the MonetizeJS platform for sign in and/or payment and
             * get user's payment object as a result.
             *
             * @see http://api.monetizejs.com/#api
             * @param options
             */
            this.getPaymentsInteractive = function(options) {
                self.monetize.getPaymentsInteractive(options || { summary: true });
            };

            this.getPayments = function() {

                var deferred = $q.defer();

                if (! this.token) {
                    deferred.reject("No access token");
                    if (self.debug) {
                        $log.info("No access token");
                    }
                    return deferred.promise;
                }

                $http.get("https://monetizejs.com/api/payments?access_token=" + this.token)
                    .success(function(payments) {
                        self.err = false;
                        self.payments = payments;
                        deferred.resolve(payments);
                        if (self.debug) {
                            $log.debug(payments);
                        }
                    })
                    .error(function(err) {
                        self.err = err;
                        self.payments = false;
                        deferred.reject(err);
                        if (self.debug) {
                            $log.debug(err);
                        }
                    });

                return deferred.promise;

            };

        }

        return Monetize;

    }]);


function getTelemetryStatus()
{
    var telemetry = window.localStorage.getItem("user.telemetry");
    return !! (telemetry === null || !! telemetry);
}

function getErrorReportingStatus()
{
    var reporting = window.localStorage.getItem("user.reporting");
    return !! (reporting === null || !! reporting);
}

function disableErrorReports()
{
    Rollbar.configure({enabled: false});
}

function enableErrorReports()
{
    Rollbar.configure({enabled: true});
}

function checkErrorReports()
{

    if(getErrorReportingStatus()) {
        enableErrorReports();
    } else {
        disableErrorReports();
    }
}

function sendTelemetry()
{
    window._paq = window._paq || [];

    try {
        if(getTelemetryStatus()) {

            (function(){

                var u="https://analytics.bitola.co/";

                window._paq.push(["setSiteId", 9]);
                window._paq.push(["setTrackerUrl", u+"piwik.php"]);
                window._paq.push(["trackPageView"]);
                window._paq.push(["enableLinkTracking"]);

                var d=document,
                    g=d.createElement("script"),
                    s=d.getElementsByTagName("script")[0];
                g.type="text/javascript"; g.defer=true;
                g.async=true;
                g.src=u+"piwik.js";

                s.parentNode.insertBefore(g,s);

            })();

        }
    } catch(err) { }

}

sendTelemetry();

angular.module("weatherApp", ["ngMaterial", "ngRoute", "ngSanitize", "ngTouch", "ngLocale", "angular.translate", "ngMonetize", "angulartics", "angulartics.piwik"])
    .config(["$routeProvider", "$mdThemingProvider", "$analyticsProvider", function($routeProvider, $mdThemingProvider, $analyticsProvider) {

        if(! window.localStorage.getItem("user.telemetry")) {
            $analyticsProvider.virtualPageviews(false);
        }

        $mdThemingProvider.theme("default")
            .primaryPalette(window.localStorage.getItem("user.theme.primary") || "blue")
            .accentPalette(window.localStorage.getItem("user.theme.accent") || "light-blue");

        $routeProvider
            .when("/locations", {
                templateUrl: "views/locations.html",
                controller: "LocationsCtrl"
            })
            .when("/locate", {
                templateUrl: "views/locate.html",
                controller: "LocateCtrl"
            })
            .when("/weather/:latitude?/:longitude?", {
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
            .when("/account", {
                templateUrl: "views/account.html",
                controller: "AccountCtrl"
            })
            .when("/about", {
                templateUrl: "views/about.html",
                controller: "AboutCtrl"
            })
            .otherwise({
                redirectTo: "/weather"
            });
    }])
    .run(["$rootScope", "$mdSidenav", "$mdDialog", "$window", "$location", "$timeout", "$interval", "Language", "FirefoxPushNotifications",
        function($rootScope, $mdSidenav, $mdDialog, $window, $location, $timeout, $interval, Language, FirefoxPushNotifications) {

            $rootScope.language = new Language();

            $rootScope.go = function(str) {
                $rootScope.closeNav();
                $location.url(str);
            };


            $rootScope.telemetry = getTelemetryStatus();
            $rootScope.reporting = getErrorReportingStatus();

            $rootScope.version = "0.1.4";
            $rootScope.versions = {
                "0.1.3": [
                    "Simplified the user interface",
                    "Improved offline support",
                    "Fixed a bug with metric snow accumulations",
                    "Added moon phase icons",
                    "Added sunrise/sunset",
                    "Added more icons",
                    "Added error reporting and telemetry",
                    "Improved translations",
                    "Added feedback form",
                    "Added version alerts"
                ],
                "0.1.4": [
                    "Updated user interface",
                    "Minor bugfixes"
                ]
            };

            $rootScope.versionAlert = function(force) {
                force = force || false;
                angular.forEach($rootScope.versions, function(changes, version) {
                    if(version === $rootScope.version) {
                        if(force || ! $window.localStorage.getItem("alerts.version." + $rootScope.version)) {
                            $mdDialog.show({
                                templateUrl: "templates/version.html",
                                controller: ["$scope", "$mdDialog", function ($scope, $mdDialog) {
                                    $scope.language = $rootScope.language;
                                    $scope.version = version;
                                    $scope.changes = changes;
                                    $scope.done = function() {
                                        $mdDialog.hide(true);
                                    };
                                }]
                            }).then(function() {
                                $window.localStorage.setItem("alerts.version." + $rootScope.version, "1");
                            });
                        }
                    }
                });
            };

            // Check error/telemetry settings and disable if not desired
            var TELEMETRY_INTERVAL = 1000 * 60 * 5;
            $interval(checkErrorReports, TELEMETRY_INTERVAL);
            $interval(sendTelemetry, TELEMETRY_INTERVAL);

            $timeout($rootScope.versionAlert, 1000);

            $rootScope.toggleNav = function() {
                $mdSidenav("right").toggle();
            };

            $rootScope.closeNav = function() {
                $mdSidenav("right").close();
            };

            $rootScope.refresh = function() {
                $rootScope.refreshing = true;
                $rootScope.$broadcast("refresh");
            };

            $rootScope.$on("refresh:complete", function() {
                $rootScope.refreshing = false;
            });

            $rootScope.$on("locations.updated", function() {
                $rootScope.$broadcast("locations.updated");
            });

            $rootScope.online = !! $window.navigator.onLine;

            $window.addEventListener("load", function() {
                checkErrorReports();
                sendTelemetry();
            });

            $window.addEventListener("online", function() {

                var online = !! navigator.onLine,
                    now = new Date();

                $rootScope.online = online;

                if (online) {
                    $rootScope.$broadcast("online", now);
                } else {
                    $rootScope.$broadcast("offline", now);
                }

            });


            $rootScope.push = {
                regs: null
            };

            var notifications = new FirefoxPushNotifications();
            notifications.init();

    }]);
