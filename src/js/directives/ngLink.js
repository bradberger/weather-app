"use strict";

angular.module("weatherApp").directive("ngLink", ["$location", function ($location) {

    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {

            function goToUrl() {
                $location.url($attrs.ngLink);
            }

            $element.on("click", function () {
                if ($scope.$$phase) {
                    goToUrl();
                } else {
                    $scope.$apply(goToUrl);
                }
            });
        }
    };

}]);