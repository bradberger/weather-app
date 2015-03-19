"use strict";

angular.module("weatherApp").directive("temperatureItem", ["$window", function($window) {

    return {
        restrict: "E",
        transclude: true,
        scope: { temp: "=", unit: "=" },
        template: "<span class='no-break'>{{ tempAmt }} <sup><i class='wi' ng-class='temperatureClass'></i></span></sup>",
        link: function($scope) {

            $scope.tempAmt = "-";

            var units = $scope.unit || $window.localStorage.getItem("user.units") || "us";
            switch(units) {
                case "us":
                    $scope.temperatureClass = "wi-fahrenheit";
                    break;
                default:
                    $scope.temperatureClass = "wi-celsius";
                    break;
            }

            function updateTemp(val) {
                if("undefined" !== typeof val) {
                    $scope.tempAmt = Math.round(val);
                }
            }

            $scope.$watch("temp", updateTemp);

        }

    };

}]);