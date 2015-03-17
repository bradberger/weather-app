"use strict";

angular.module("weatherApp").directive("temperatureItem", ["$window", "$log", "$filter", function($window, $log, $filter) {

    return {
        restrict: "E",
        transclude: true,
        scope: { temp: "=", unit: "=" },
        template: "<span class='no-break'>{{ tempAmt }} <sup><i class='wi' ng-class='temperatureClass'></i></span></sup>",
        link: function($scope, $element, $attrs) {

            $scope.tempAmt = "-";

            function updateTemp() {
                var format = ($attrs.ngUnit || $window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
                $scope.tempAmt = $filter("temperature")($scope.temp, format);
                $scope.temperatureClass = format.charAt(0) === "m" ? "wi-celsius" : "wi-fahrenheit";
            }

            $scope.$watch("temp", function(val) {
                if("undefined" !== typeof val) {
                    updateTemp(val);
                }
            });

        }
    };

}]);