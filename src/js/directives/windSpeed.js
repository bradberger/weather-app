"use strict";

angular.module("weatherApp").directive("windSpeed", ["$window", "$log", "$filter", function($window) {

    return {
        restrict: "E",
        scope: {speed: "=", units: "="},
        template: "<span>{{ windSpeed | distance }}<sup><small>{{ label }}</small></sup></span>",
        link: function($scope) {

            var unit = $scope.units || $window.localStorage.getItem("user.units") || "imperial";
            function update(value) {
                $scope.windSpeed = Math.round(value);
            }

            $scope.label = "-";
            $scope.windSpeed = "-";
            $scope.label = unit.charAt(0) === "m" ? "kph" : "mph";
            $scope.$watch("speed", function(val) {
                if("undefined" !== typeof val) {
                    update(val);
                }
            });

        }
    };

}]);