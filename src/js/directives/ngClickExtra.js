"use strict";

angular.module("weatherApp").directive("ngClickExtra", [function () {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            $element.bind("click", function() {
                $scope.$eval($attrs.ngClickExtra);
            });
        }
    };
}]);