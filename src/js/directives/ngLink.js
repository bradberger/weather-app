"use strict";

angular.module("weatherApp").directive("ngLink", ["$location", function ($location) {

    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {

            $element.on("click", function () {
                $scope.closeNav();
                $location.url($attrs.ngLink);
            });

        }
    };

}]);