"use strict";

angular.module("weatherApp").controller("HomeCtrl", ["$scope", "$window", "$q", "Locations", "Geolocate",
    function ($scope, $window, $q, Locations, Geolocate) {

        $scope.geolocation = $window.localStorage.getItem("user.geolocation");
        $scope.currentLocation = false;

        var init = function () {

            var locations = new Locations();
            $scope.locations = locations.data;

            getLocation();

        };

        var getLocation = function() {

            var deferred = $q.defer();
            if ($scope.geolocation) {
                var geolocate = new Geolocate();
                geolocate.locate().then(function(coords) {
                    $scope.currentLocation = {
                        label: "Current location",
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    };
                });
            }

            deferred.reject("Geolocation disabled");
            return deferred.promise;

        };


        $scope.$on("refresh", init);
        $scope.$on("locations.updated", init);

        init();

    }]);
