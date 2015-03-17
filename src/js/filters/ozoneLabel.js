
"use strict";

angular.module("weatherApp").filter("ozoneLabel", function() {

    return function (value) {
        return [value, "ρA"].join(" ");
    };

});

