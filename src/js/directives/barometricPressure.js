"use strict";

angular.module("weatherApp").directive("barometricPressure", ["$window", function($window) {

    return {
        restrict: "E",
        scope: {value: "=", units: "="},
        template: "<span>{{ value|number:0 }}<sup><small>{{ label }}</small></sup></span>",
        link: function($scope) {

            switch($scope.units || $window.localStorage.getItem("user.units") || "us") {
                case "ca":
                case "uk":
                case "si":
                    $scope.label = "hPa";
                    break;
                default:
                    $scope.label = "mbar";
                    break;
            }

        }
    };

}]);