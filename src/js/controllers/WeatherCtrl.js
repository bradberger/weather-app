"use strict";

angular.module("weatherApp")
    .controller("WeatherCtrl",
    ["$scope", "$routeParams", "$log", "$location", "Geolocate", "Forecast", "Locations", "$mdToast", "$mdMedia", "$interval", "$filter", "$window",
        function($scope, $routeParams, $log, $location, Geolocate, Forecast, Locations, $mdToast, $mdMedia, $interval, $filter, $window) {

        $scope.report = false;
        $scope.title = $routeParams.title;
        $scope.position = {
            latitude: $routeParams.latitude || false,
            longitude: $routeParams.longitude || false
        };

        $scope.screenIsSmall = $mdMedia("sm");

        $scope.data = {
            selectedIndex : 0,
            secondLocked : true,
            secondLabel : "Item Two"
        };
        $scope.next = function() {
            $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
        };
        $scope.previous = function() {
            $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
        };

        var units = $window.localStorage.getItem("user.units") || "us";
        var lang = $window.localStorage.getItem("user.language") || "en";
        var forecastio = new Forecast();
        var locator = new Geolocate();

        var updatePosition = function(position) {
            $scope.position = position;
            return forecastio.get(position.latitude, position.longitude, lang, units)
                .then(function(data) {
                    $scope.report = data;
                    $window.report = $scope.report;


                    // This isn't quite DRY, but it sets the initial page background
                    // since we don't remember tab state quite yet.
                    if ($scope.report.currently.icon || false) {
                        var body = angular.element(document.querySelector("body"));
                        body.removeClass([
                            "clear-day",
                            "clear-night",
                            "rain",
                            "snow",
                            "sleet",
                            "wind",
                            "fog",
                            "cloudy",
                            "partly-cloudy-day",
                            "partly-cloudy-night"
                        ].join(" "));
                        body.addClass($scope.report.currently.icon);
                    }


                    $mdToast.showSimple(
                        $filter("translate")("Report updated.", $scope.language.translator.current)
                    );
                    startUpdate();
                });
        };

        var onError = function(err) {
            $mdToast.showSimple(err.message || err);
        };

        var init = function() {

            if ($scope.position.latitude && $scope.position.longitude)
            {
                return updatePosition($scope.position);
            } else {
                return locator.init()
                    .then(updatePosition)
                    .catch(onError);
            }

        };

        $scope.$on("refresh", function() {
            init().finally(function() {
                $scope.$emit("refresh:complete");
            });
        });

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

        $scope.$on("$destroy", cancelUpdate);
        $scope.$on("offline", cancelUpdate);
        $scope.$on("online", startUpdate);

        init();

    }]);
