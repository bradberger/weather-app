"use strict";

angular.module("weatherApp").directive("weatherSummary", ["$rootScope", "$mdMedia", function ($rootScope, $mdMedia) {

    return {
        restrict: "E",
        transclude: true,
        scope: {day: "="},
        templateUrl: "templates/summary.html",
        link: function ($scope) {

            $scope.screenIsSmall = $mdMedia("sm");
            $scope.language = $rootScope.language;

        }
    };

}]);