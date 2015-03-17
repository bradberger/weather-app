"use strict";

angular.module("weatherApp").filter("timestamp", [function() {
    return function (timestamp) {
        return new Date(timestamp * 1000);
    };
}]);