"use strict";

angular.module("weatherApp").controller("MenuCtrl", ["$scope", "$window", "Locations", function($scope, $window, Locations) {

    var init = function() {
        var locations = new Locations();
        $scope.locations = locations.data;
    };

    $scope.$on("refresh", init);
    $scope.$on("locations.updated", init);

    init();

}]);
