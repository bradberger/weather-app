"use strict";

angular.module("weatherApp").directive("closeNav", ["$mdSidenav", function ($mdSidenav) {
    return {
        restrict: "A",
        link: function ($scope, $element) {
            function closeNav() {
                $mdSidenav("right").close();
            }
            $element.on("click", function () {
                if ($scope.$$phase) {
                    closeNav();
                } else {
                    $scope.$apply(closeNav);
                }
            });
        }
    };
}]);
