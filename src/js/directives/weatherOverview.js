"use strict";

angular.module("weatherApp").directive("weatherOverview", ["$rootScope", "$window", "$mdMedia", "$mdToast", "$filter", "$interval", "$timeout", "Forecast", "$ionicSlideBoxDelegate",
    function ($rootScope, $window, $mdMedia, $mdToast, $filter, $interval, $timeout, Forecast, $ionicSlideBoxDelegate) {

        return {
            restrict: "E",
            scope: {location: "="},
            templateUrl: "templates/overview.html",
            link: function ($scope) {

                $scope.report = false;
                $scope.offset = 0;
                $scope.screenIsSmall = $mdMedia("sm");
                $scope.language = $rootScope.language;
                $scope.loaded = false;

                var units = $window.localStorage.getItem("user.units") || "us";
                var lang = $rootScope.getLanguage();
                var forecastio = new Forecast();

                var updatePosition = function(latitude, longitude) {
                    return forecastio.get(latitude, longitude, lang, units)
                        .then(function(data) {

                            $scope.report = true;
                            $scope.currently = angular.copy(data.currently);
                            $scope.daily = angular.copy(data.daily);
                            $scope.hourly = angular.copy(data.hourly);
                            $scope.offset = angular.copy(data.offset);

                            $window.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                            $ionicSlideBoxDelegate.update();
                            $scope.loaded = true;

                            var boxes = document.getElementsByClassName("slider-slides");
                            angular.forEach(boxes, function(box) {
                                while(box.getElementsByTagName("ion-slide").length > 2) {
                                    box.removeChild(box.getElementsByTagName("ion-slide")[2]);
                                }
                            });

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
                // Let the forecast service and backend handle the real rates.
                var autoUpdate;
                var AUTO_UPDATE_INTERVAL = 60000;
                var startUpdate = function() {
                    if (! autoUpdate) {
                        autoUpdate = $interval(init, AUTO_UPDATE_INTERVAL);
                    }
                };
                var cancelUpdate = function() {
                    if (autoUpdate || false) {
                        $interval.cancel(autoUpdate);
                    }
                };

                $scope.$on("$destroy", cancelUpdate);
                $scope.$watch("location", function(location) {
                    if (! $scope.report) {
                        if(location) {
                            init();
                            startUpdate();
                        }
                    }
                });

            }
        };

    }]);