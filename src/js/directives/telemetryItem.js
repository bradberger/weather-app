"use strict";

angular.module("weatherApp").directive("telemetryItem", function() {

    return {
        restrict: "E",
        scope: true,
        template: "<img ng-src='{{ telemetryImgSrc }}' class='telemetry-img'>",
        link: function($scope, $element, $attrs) {

            function update() {
                var src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                if ($scope.online && $scope.telemetry) {
                    src = "https://analytics.bitola.co/piwik.php?idsite=9&rec=1";
                    if($attrs.title) {
                        src += "&action_name=" + $attrs.title;
                    }
                }
                $scope.telemetryImgSrc = src;
            }

            $scope.$watch("online", update);

            update();

        }
    };

});