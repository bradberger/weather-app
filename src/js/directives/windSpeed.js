"use strict";

angular.module("weatherApp").directive("windSpeed", ["$window", "$log", "$filter", function($window) {

    return {
        restrict: "E",
        scope: {speed: "=", units: "="},
        template: "<span>{{ value }}<sup><small>{{ label }}</small></sup></span>",
        link: function($scope) {

            switch($scope.units || $window.localStorage.getItem("user.units") || "us") {
                case "si":
                    $scope.label = "m/s";
                    break;
                case "ca":
                    $scope.label = "kph";
                    break;
                default:
                    $scope.label = "mph";
                    break;
            }

            function update(value) {
                if (value) {
                    $scope.value = Math.round(value);
                }
            }

            $scope.$watch("speed", update);

        }
    };

}]);