"use strict";

angular.module("weatherApp").filter("timestamp", [function() {
    return function (timestamp, offset) {

        if ("undefined" !== typeof offset) {
            offset = parseInt(offset) - (((new Date()).getTimezoneOffset() / 60) * -1);
            timestamp += (3600 * offset);
        }

        return new Date(timestamp * 1000);
    };
}]);