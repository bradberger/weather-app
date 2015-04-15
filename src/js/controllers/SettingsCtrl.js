"use strict";

angular.module("weatherApp").controller("SettingsCtrl", ["$scope", "$window", "Locations", "$mdToast", "Forecast", "$mdDialog", "$filter",
    function ($scope, $window, Locations, $mdToast, Forecast, $mdDialog, $filter) {

        var forecast = new Forecast();

        $scope.color = $window.localStorage.getItem("user.theme.primary") || "blue-grey";
        $scope.accent = $window.localStorage.getItem("user.theme.accent") || "blue-grey";
        $scope.lang = $scope.getLanguage($window);
        $scope.units = $window.localStorage.getItem("user.units") || "imperial";

        $scope.colors = [
            "red", "pink", "purple", "deep-purple", "indigo", "blue",
            "light-blue", "cyan", "teal", "green", "light-green", "lime",
            "yellow", "amber", "orange", "deep-orange", "brown", "grey",
            "blue-grey"
        ];


        var translate = function (str) {
            return $filter("translate")(str, $scope.language.translator.current);
        };

        var clearCachedResults = function () {
            forecast.clearCache();
        };

        var updateSuccess = function (msg) {
            $mdToast.showSimple(translate(msg || "Settings saved. Reloading."));
            $window.location.reload();
        };

        var switchTheme = function (color) {
            if ($scope.colors.indexOf(color) >= 0) {
                $window.localStorage.setItem("user.theme.primary", color);
                updateSuccess();
            }
        };

        var switchAccent = function (color) {
            if ($scope.colors.indexOf(color) >= 0) {
                $window.localStorage.setItem("user.theme.accent", color);
                updateSuccess();
            }
        };

        var switchUnits = function (unit) {
            $window.localStorage.setItem("user.units", unit);
            clearCachedResults();
            updateSuccess();
        };

        var switchLanguage = function (lang) {
            clearCachedResults();
            return $scope.language.use(lang).then(updateSuccess);
        };

        $scope.clearAll = function () {

            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title(translate("Delete App Data"))
                .content(translate("Deleting app data will clear all your locations and preferences."))
                .ok(translate("Yes"))
                .cancel(translate("Cancel"));

            $mdDialog.show(confirm).then(function () {

                $window.localStorage.clear();
                $mdToast.showSimple(translate("Data deleted successfully"));
                $window.location.reload();

            }, function () {
                $mdToast.showSimple(translate("User canceled deleting of data"));
            });

        };

        $scope.toggleErrorReporting = function () {
            $window.localStorage.setItem("user.reporting", $scope.reporting ? "" : "1");
            $window.location.reload();
        };

        $scope.toggleTelemetry = function () {
            $window.localStorage.setItem("user.telemetry", $scope.telemetry ? "" : "1");
            $window.location.reload();
        };

        $scope.$on("refresh", function () {
            $window.location.reload();
        });

        $scope.$watch("units", function (val, old) {
            if (old && val && old !== val) {
                switchUnits(val);
            }
        });

        $scope.$watch("color", function (val, old) {
            if (old && val && old !== val) {
                switchTheme(val);
            }
        });

        $scope.$watch("accent", function (val, old) {
            if (old && val && old !== val) {
                switchAccent(val);
            }
        });

        $scope.$watch("lang", function (val, old) {
            if (old && val && old !== val) {
                switchLanguage(val);
            }
        });

    }]);
