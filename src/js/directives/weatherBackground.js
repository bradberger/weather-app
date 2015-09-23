"use strict";

angular.module("weatherApp").directive("weatherBackground", ["$timeout", function ($timeout) {
    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {
            var container = angular.element(document.querySelector(".background"));
            var classes = [
                "clear-day",
                "clear-night",
                "rain",
                "snow",
                "sleet",
                "wind",
                "fog",
                "cloudy",
                "partly-cloudy-day",
                "partly-cloudy-night"
            ];
            var handleClass = function() {
                $timeout(function() {
                    var bg = $attrs.weatherBackground || false;
                    if (bg) {
                        container.removeClass(classes.join(" "));
                        container.addClass(bg);
                    }
                }, 200);
            };
            $element.bind("click", handleClass);
        }
    };
}]);
