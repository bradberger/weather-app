"use strict";

angular.module("weatherApp")
    .controller("WeatherCtrl", ["$scope", "$routeParams", "$location", function ($scope, $routeParams, $location) {

        $scope.location = {
            label: $routeParams.title,
            latitude: $routeParams.latitude,
            longitude: $routeParams.longitude
        };

        $scope.goBack = function() {
            $location.url("/home");
        };

    }]);
