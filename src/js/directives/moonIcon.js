"use strict";

angular.module("weatherApp").directive("moonIcon", function() {

    return {
        restrict: "E",
        transclude: true,
        scope: { value: "=" },
        template: "<span class='no-break'><i class='wi {{ phaseIcon }}'></i></span>",
        link: function($scope) {

            $scope.phaseAmt = "-";
            $scope.phaseIcon = "";

            var phases = [
                "wi-moon-new",
                "wi-moon-waxing-cresent-1",
                "wi-moon-waxing-cresent-2",
                "wi-moon-waxing-cresent-3",
                "wi-moon-waxing-cresent-4",
                "wi-moon-waxing-cresent-5",
                "wi-moon-waxing-cresent-6",
                "wi-moon-first-quarter",
                "wi-moon-waxing-gibbous-1",
                "wi-moon-waxing-gibbous-2",
                "wi-moon-waxing-gibbous-3",
                "wi-moon-waxing-gibbous-4",
                "wi-moon-waxing-gibbous-5",
                "wi-moon-waxing-gibbous-6",
                "wi-moon-full",
                "wi-moon-waning-gibbous-1",
                "wi-moon-waning-gibbous-2",
                "wi-moon-waning-gibbous-3",
                "wi-moon-waning-gibbous-4",
                "wi-moon-waning-gibbous-5",
                "wi-moon-waning-gibbous-6",
                "wi-moon-3rd-quarter",
                "wi-moon-waning-crescent-1",
                "wi-moon-waning-crescent-2",
                "wi-moon-waning-crescent-3",
                "wi-moon-waning-crescent-4",
                "wi-moon-waning-crescent-5",
                "wi-moon-waning-crescent-6"
            ];

            function round(num, places) {
                var multiplier = Math.pow(10, places);
                return Math.round(num * multiplier) / multiplier;
            }

            function update(val) {

                if("undefined" === typeof val) {
                    return;
                }

                var phaseVal;

                $scope.phaseIcon = "";
                $scope.phaseAmt = parseFloat(val);
                if ($scope.phaseAmt >= 0.96) {
                    $scope.phaseIcon = angular.copy(phases[phases.length - 1]);
                } else {
                    angular.forEach(phases, function(icon, i) {
                        if (! $scope.phaseIcon) {
                            phaseVal = round(parseInt(i) * 0.0357142857142857, 2);
                            if ($scope.phaseAmt <= phaseVal) {
                                $scope.phaseIcon = angular.copy(icon);
                            }
                        }
                    });
                }
            }

            $scope.$watch("value", update);

        }
    };

});