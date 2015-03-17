"use strict";

angular.module("weatherApp").filter("temperature", ["$window", function($window) {

    return function (temp) {

        var format = ($window.localStorage.getItem("user.units") || "i").toLocaleLowerCase();

        temp = parseFloat(temp);
        temp = format.charAt(0) === "m" ? (temp - 32) * (5 / 9) : temp;

        return Math.round(temp);

    };

}]);