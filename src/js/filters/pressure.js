"use strict";

angular.module("weatherApp").filter("pressure", ["$window", function($window) {

    return function (value) {

        function round(num, places) {
            var multiplier = Math.pow(10, places);
            return Math.round(num * multiplier) / multiplier;
        }

        // Default is mbar, to convert to in/Hg use * 0.0295301
        var format = ($window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
        value = parseFloat(format.charAt(0) === "m" ? value : value * 0.0295301);

        return Number.isNaN(value) ? 0 : round(value, 2);

    };

}]);