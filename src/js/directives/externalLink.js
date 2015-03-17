"use strict";

angular.module("weatherApp").directive("externalLink", function() {

    return {
        restrict: "AE",
        link: function($scope, $element, $attrs) {

            var hasMozActivity = "undefined" !== typeof MozActivity;

            $element.prop("target", "_blank");
            $element.on("click", function(e) {

                if (hasMozActivity) {

                    e.preventDefault();
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url",
                            url: $attrs.href
                        }
                    });

                }

            });

        }
    };

});