"use strict";

angular.module("weatherApp").filter("distance", ["$window", function($window) {

    return function (miles) {

        var format = ($window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
        var dist = parseFloat(miles);

        if(Number.isNaN(dist)) {
            return null;
        } else {
            return Math.round(format.charAt(0) === "m" ? dist * 1.609 : dist);
        }

    };

}]);