"use strict";

angular.module("weatherApp").directive("barometricPressure", ["$window", "$log", "$filter", function($window, $log, $filter) {

    return {
        restrict: "E",
        scope: {value: "=", units: "="},
        template: "<span>{{ pressure | distance }}<sup><small>{{ label }}</small></sup></span>",
        link: function($scope) {

            var unit = $scope.units || $window.localStorage.getItem("user.units") || "imperial";
            function update(value) {
                $scope.pressure = unit.charAt(0) === "m" ? Math.round(value) : $filter("number")(value * 0.0295301, 2);
            }

            $scope.label = "-";
            $scope.windSpeed = "-";
            $scope.label = unit.charAt(0) === "m" ? "mbar" : " in/Hg";
            $scope.$watch("value", function(val) {
                if("undefined" !== typeof val) {
                    update(val);
                }
            });

        }
    };

}]);