"use strict";

angular.module("weatherApp").directive("precipitationSummary", function() {

    return {
        restrict: "E",
        transclude: true,
        scope: { day: "=" },
        templateUrl: "templates/precipitation.html"
    };

});