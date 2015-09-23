"use strict";

angular.module("weatherApp").directive("telemetryItem", ["$location", function($location) {
    return {
        restrict: "E",
        scope: true,
        link: function($scope) {
            var update = function() {
                if($scope.online && $scope.telemetry && "undefined" !== typeof ga) {
                    ga("set", "appName", "Weather");
                    ga("set", "appId", "com.bitola.weather");
                    ga("set", "appVersion", $scope.version);
                    ga("set", "anonymizeIp", true);
                    ga("set", "forceSSL", true);
                    ga("send", "pageview", $location.url());
                }
            };
            $scope.$watch("online", update);
            update();
        }
    };
}]);
