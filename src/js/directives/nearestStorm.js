"use strict";

angular.module("weatherApp").directive("nearestStorm", ["$window", "$log", "$filter", function($window) {

    return {
        restrict: "E",
        scope: {value: "=", units: "="},
        template: "<span>{{ value }}<sup>{{ label }}</sup></span>",
        link: function($scope) {

            var unit = $scope.units || $window.localStorage.getItem("user.units") || "us";
            switch(unit) {
                case "ca":
                case "uk":
                case "si":
                    $scope.label = "km";
                    break;
                default:
                    $scope.label = "mi";
                    break;
            }

        }
    };

}]);