"use strict";

angular.module("weatherApp").filter("pressureLabel", ["$window", function($window) {

    return function (value) {

        // Default is mbar
        var format = ($window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
        return [value, format.charAt(0) === "m" ? " mbar" : " in/Hg"].join(" ");

    };

}]);