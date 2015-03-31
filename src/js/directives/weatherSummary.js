"use strict";

angular.module("weatherApp").directive("weatherSummary", ["$rootScope", "$window", "$mdMedia", "$mdToast", "$filter", "$interval", "Forecast",
    function ($rootScope, $window, $mdMedia, $mdToast, $filter, $interval, Forecast) {

    return {
        restrict: "E",
        scope: {location: "="},
        templateUrl: "templates/summary.html",
        link: function ($scope) {

            $scope.report = false;
            $scope.offset = 0;
            $scope.screenIsSmall = $mdMedia("sm");
            $scope.language = $rootScope.language;

            var units = $window.localStorage.getItem("user.units") || "us";
            var lang = $window.localStorage.getItem("user.language") || "en";
            var forecastio = new Forecast();
            var updatePosition = function(latitude, longitude) {
                return forecastio.get(latitude, longitude, lang, units)
                    .then(function(data) {
                        $scope.report = true;
                        $scope.currently = angular.copy(data.currently);
                        $scope.daily = angular.copy(data.daily);
                        $scope.hourly = angular.copy(data.hourly);
                        $scope.offset = angular.copy(data.offset);
                        startUpdate();

                    })
                    .catch(onError);
            };

            var onError = function(err) {
                $mdToast.showSimple(err.message || err);
            };

            var init = function() {
                return updatePosition($scope.location.latitude, $scope.location.longitude);
            };

            // These handle background updates.
            var autoUpdate;
            var AUTO_UPDATE_INTERVAL = 30 * 60 * 1000;

            var startUpdate = function() {
                cancelUpdate();
                if ($scope.online) {
                    autoUpdate = $interval(init, AUTO_UPDATE_INTERVAL);
                }
            };
            var cancelUpdate = function() {
                if (autoUpdate || false) {
                    $interval.cancel(autoUpdate);
                }
            };

            var frames = ["default", "hourly", "extended"];
            $scope.selection = frames[0];
            $scope.setSelection = function(str) {
                $scope.selection = str;
            };

            $scope.prevFrame = function() {
                var pos = frames.indexOf($scope.selection);
                $scope.setSelection(frames[pos <= 0 ? (frames.length - 1) : pos - 1]);
            };

            $scope.nextFrame = function() {
                var pos = frames.indexOf($scope.selection);
                $scope.setSelection(frames[pos >= (frames.length - 1) ? 0 : pos + 1]);
            };

            $scope.$on("$destroy", cancelUpdate);
            $scope.$on("offline", cancelUpdate);
            $scope.$on("online", startUpdate);
            $scope.$on("refresh", init);
            $scope.$watch("location", function(location) {
                if (location) {
                    init();
                }
            });

        }
    };

}]);