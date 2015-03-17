"use strict";

angular.module("weatherApp").directive("nearestStorm", ["$window", "$log", "$filter", function($window) {

    return {
        restrict: "E",
        scope: {value: "=", units: "="},
        template: "<span>{{ nearest }}<sup>{{ label }}</sup></span>",
        link: function($scope) {

            var unit = $scope.units || $window.localStorage.getItem("user.units") || "imperial";
            function update(value) {
                $scope.nearest = Math.round(value);
            }

            $scope.nearest = "-";
            $scope.label = unit.charAt(0) === "m" ? "km" : "mi";
            $scope.$watch("value", function(val) {
                if(val) {
                    update(val);
                }
            });

        }
    };

}]);