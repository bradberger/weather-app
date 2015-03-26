"use strict";

angular.module("weatherApp").directive("temperatureItem", [function() {

    return {
        restrict: "E",
        scope: { temp: "=" },
        template: "<span>{{ temp|number:0 }}&deg;</span>"
    };

}]);