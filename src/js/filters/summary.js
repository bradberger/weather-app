"use strict";

angular.module("weatherApp").filter("summary", ["$window", function($window) {

    return function (val) {

        var format = ($window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
        var matches = 0;

        // This converts inches to cm, if there are numbers in inches.
        if ("undefined" !== typeof val && format.charAt(0) !== "i") {
            val = val.toString();
            if (val.match(/in\.+/g)) {
                val = val.replace(/in\.+/g, "cm");
                val = val.replace(/[0-9]+/gi, function(match) {
                    var val = parseFloat(match) * 2.54;
                    matches++;
                    return matches > 1 ? Math.ceil(val) : Math.floor(val);
                });
            }
        }

        return val;

    };

}]);