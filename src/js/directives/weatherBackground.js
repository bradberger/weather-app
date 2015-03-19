"use strict";

angular.module("weatherApp").directive("weatherBackground", ["$timeout", function ($timeout) {

    return {
        restrict: "A",
        link: function ($scope, $element, $attrs) {

            var body = angular.element(document.querySelector("html"));
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
                    console.log("weatherBackground.click", $attrs.weatherBackground);
                    if (bg) {
                        body.removeClass(classes.join(" "));
                        body.addClass(bg);

                    }
                }, 300);
             };

             $element.bind("click", handleClass);

       }
    };

}]);