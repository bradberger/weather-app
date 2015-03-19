"use strict";

angular.module("weatherApp").directive("changeDay", [function () {

    return {
        restrict: "A",
        link: function ($scope, $element) {
            $element.bind("click", function() {
                $scope.$parent.$parent.selectedDay = $scope.info;
            });
        }
    };

}]);