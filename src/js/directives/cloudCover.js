"use strict";

angular.module("weatherApp").directive("cloudCover", function() {

    return {
        restrict: "E",
        scope: { value: "=", units: "=" },
        template: "<span>{{ amt }}<sup><small>%</small></sup></span>",
        link: function($scope) {
            $scope.amt = "-";
            $scope.$watch("value", function(val) {
                if("undefined" !== typeof val) {
                    $scope.amt = Math.round(val * 100);
                }
            });
        }
    };

});