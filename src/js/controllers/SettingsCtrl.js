"use strict";

angular.module("weatherApp").controller("SettingsCtrl", ["$scope", "$window", "Locations", "$mdToast", function($scope, $window, Locations, $mdToast) {

        $scope.color = $window.localStorage.getItem("user.theme.primary") || "blue-grey";
        $scope.accent = $window.localStorage.getItem("user.theme.accent") || "blue-grey";
        $scope.lang = $window.localStorage.getItem("user.language") || "en";
        $scope.units = $window.localStorage.getItem("user.units") || "imperial";

        $scope.colors = [
            "red", "pink", "purple", "deep-purple", "indigo", "blue",
            "light-blue", "cyan", "teal", "green", "light-green", "lime",
            "yellow", "amber", "orange", "deep-orange", "brown", "grey",
            "blue-grey"
        ];

        var updateSuccess = function(msg) {
            $mdToast.showSimple(msg || "Settings saved. Reloading");
            $window.location.reload();
        };

        var switchTheme = function(color) {
            if ($scope.colors.indexOf(color) >= 0) {
                $window.localStorage.setItem("user.theme.primary", color);
                updateSuccess();
            }
        };

        var switchAccent = function(color) {
            if ($scope.colors.indexOf(color) >= 0) {
                $window.localStorage.setItem("user.theme.accent", color);
                updateSuccess();
            }
        };

        var switchUnits = function(unit) {
            $window.localStorage.setItem("user.units", unit);
            updateSuccess();
        };

        var switchLanguage = function(lang) {
            return $scope.language.use(lang).then(function() {
                updateSuccess();
            });
        };

        $scope.toggleErrorReporting = function() {
            $window.localStorage.setItem("user.reporting", $scope.reporting ? "" : "1");
            $window.location.reload();
        };

        $scope.toggleTelemetry = function() {
            $window.localStorage.setItem("user.telemetry", $scope.telemetry ? "" : "1");
            $window.location.reload();
        };

        $scope.$on("refresh", function() {
            $window.location.reload();
        });

        $scope.$watch("units", function(val, old) {
            if(old && val && old !== val) {
                switchUnits(val);
            }
        });

        $scope.$watch("color", function(val, old) {
            if(old && val && old !== val) {
                switchTheme(val);
            }
        });

        $scope.$watch("accent", function(val, old) {
            if(old && val && old !== val) {
                switchAccent(val);
            }
        });

        $scope.$watch("lang", function(val, old) {
            if(old && val && old !== val) {
                switchLanguage(val);
            }
        });

    }]);
