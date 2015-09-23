"use strict";

angular.module("weatherApp").directive("visibility", ["$window", "$log", "$filter", function($window) {
    return {
        restrict: "E",
        scope: {value: "=", units: "="},
        template: "<span>{{ visibility }}<sup>{{ label }}</sup></span>",
        link: function($scope) {
            $scope.visibility = "-";
            switch($scope.units || $window.localStorage.getItem("user.units") || "us") {
            case "ca":
            case "uk":
            case "si":
                $scope.label = "km";
                break;
            default:
                $scope.label = "mi";
                break;
            }
            function update(value) {
                if ("undefined" !== typeof value) {
                    $scope.visibility = Math.round(value);
                }
            }
            $scope.$watch("value", update);
        }
    };
}]);
