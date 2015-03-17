"use strict";

angular.module("weatherApp").filter("speedLabel", ["$window", function($window) {

    return function (distance) {

        var format = ($window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();
        return [distance, format.charAt(0) === "m" ? "km/h" : "mph"].join(" ");

    };

}]);