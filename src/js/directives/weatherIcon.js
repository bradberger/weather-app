"use strict";

angular.module("weatherApp").directive("weatherIcon", function() {

    return {
        restrict: "E",
        replace: false,
        template: "<md-icon md-font-icon='wi {{ iconClass }}'></md-icon>",
        link: function($scope, $element, $attrs) {

            var classMap = {
                "clear-day": "wi-day-sunny",
                "clear-night": "wi-night-clear",
                "rain": "wi-rain",
                "snow": "wi-snow",
                "sleet": "wi-sleet",
                "wind": "wi-cloudy-gusts",
                "fog": "wi-fog",
                "cloudy": "wi-cloudy",
                "partly-cloudy-day": "wi-day-cloudy",
                "partly-cloudy-night": "wi-night-cloudy"
            };

            var updateClass = function(value) {
                $scope.iconClass = classMap[value] || "wi-horizon-alt";
            };

            $attrs.$observe("ngIcon", updateClass);

        }
    };

});