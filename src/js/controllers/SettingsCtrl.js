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

        var switchUnits = function (unit) {

            if($window.localStorage.getItem("user.units") !== unit) {
                clearCachedResults();
                $window.localStorage.setItem("user.units", unit);
            }

        };

        var switchLanguage = function (lang) {
            clearCachedResults();
            return $scope.language.use(lang).then(updateSuccess);
        };

        var unitsHelpCtrl = function($scope, $mdDialog) {

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

        };

        $scope.unitsHelp = function(ev) {

            $mdDialog.show({
                controller: unitsHelpCtrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: "templates/units-help.html"
            }).then(function(unit) {
                if (unit) {
                    $scope.units = unit;
                }
            });

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
            if (val) {
                switchUnits(val);
            }
        });

        $scope.$watch("color", function (val) {
            if (val) {
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
