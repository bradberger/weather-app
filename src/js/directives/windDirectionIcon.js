"use strict";

angular.module("weatherApp").directive("windDirectionIcon", function() {

    return {
        restrict: "E",
        replace: true,
        scope: { bearing: "=" },
        template: "<span><i class='wi wi-fw wi-up text-center' style='transform: rotate({{ bearing }}deg)'></i></span>",
        link: function($scope) {

            $scope.bearing = "-";

            function updateStyle(value) {
                $scope.bearing = value;
            }

            $scope.$watch("bearing", function(val) {
                if("undefined" !== typeof val) {
                    updateStyle(val);
                }
            });

        }
    };

});