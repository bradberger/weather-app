"use strict";

angular.module("weatherApp").directive("weatherIcon", function() {

    return {
        restrict: "E",
        replace: false,
        templateUrl: "templates/weather-icon.html",
        link: function($scope, $element, $attrs) {

            var updateClass = function(value) {
                $scope.icon = value;
            };

            $attrs.$observe("ngIcon", updateClass);

        }
    };

});