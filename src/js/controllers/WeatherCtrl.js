"use strict";

angular.module("weatherApp").controller("WeatherCtrl", ["$scope", "$routeParams", "$log", "$location", "Geolocate", "Forecast", "Locations", "$mdToast", "$mdMedia", "$interval",
    function($scope, $routeParams, $log, $location, Geolocate, Forecast, Locations, $mdToast, $mdMedia, $interval) {

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

        var forecastio = new Forecast("d886a460faef2e05e81d927167e5da2a");
        var locator = new Geolocate();

        var updatePosition = function(position) {
            $scope.position = position;
            return forecastio.get(position.latitude, position.longitude)
                .then(function(data) {
                    $scope.report = data;
                    $mdToast.showSimple("Report updated");
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
