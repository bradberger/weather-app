"use strict";

angular.module("weatherApp").directive("ozone", function() {

    return {
        restrict: "E",
        scope: {ozone: "="},
        template: "<span>{{ ozone|number:0 }}<sup><small>ρA</small></sup></span>"
    };

});