"use strict";

angular.module("weatherApp").directive("precipitationSummary", ["$window", "$rootScope", function($window, $rootScope) {

    return {
        restrict: "E",
        transclude: true,
        scope: { day: "=" },
        templateUrl: "templates/precipitation.html",
        link: function($scope, $element, $attrs) {

            function update(day) {

                $scope.language = $rootScope.language;
                $scope.day = day;

                var format = ($attrs.ngUnit || $window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
                var amt = parseFloat(day.precipIntensity);
                if (amt <= 0.002) {
                    $scope.intensity = "very light";
                } else if(amt <= 0.017) {
                    $scope.intensity = "light";
                } else if(amt <= 0.1) {
                    $scope.intensity = "moderate";
                } else {
                    $scope.intensity = "heavy";
                }

                if (day.precipAccumulation) {
                    $scope.accumulationMin = Math.floor(day.precipAccumulation);
                    $scope.accumulationMax = Math.ceil(day.precipAccumulation);
                    $scope.accumulationLabel = format.charAt(0) === "m" ? "cm": "in";
                }



            }

            $scope.$watch("day", function(val) {
                if ("undefined" !== typeof val) {
                    update(val);
                }
            });

        }
    };

}]);