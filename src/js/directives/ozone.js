"use strict";

angular.module("weatherApp").directive("ozone", function() {

    return {
        restrict: "E",
        scope: {ozone: "=", units: "="},
        template: "<span>{{ value }}<sup><small>{{ label }}</small></sup></span>",
        link: function($scope) {

            function update(value) {
                $scope.value = Math.round(value);
            }

            $scope.label = "ρA";
            $scope.value = "-";
            $scope.$watch("ozone", function(val) {
                if("undefined" !== typeof val) {
                    update(val);
                }
            });

        }
    };

});