
"use strict";

angular.module("weatherApp").controller("LocationsCtrl", ["$scope", "$filter", "$window", "$location", "Locations", "$mdToast", "$log",
    function($scope, $filter, $window, $location, Locations, $mdToast, $log) {

        $scope.locations = new Locations();
        $scope.searchAddress = "";
        $scope.searchResults = [];
        $scope.searching = false;
        $scope.search = function() {
            if ($scope.searchAddress) {
                $scope.searching = true;
                $scope.locations.query($scope.searchAddress)
                    .then(function(data) {
                        $scope.searchResults = data;
                    })
                    .catch(function(err) {

                        $scope.searchResults = [];

                        if (err.status==="ZERO_RESULTS") {
                            $mdToast.showSimple("No results found. Try again.");
                            $scope.searchAddress = "";
                        } else {
                            $log.error(err);
                            $mdToast.showSimple(err.status || "Unknown error. Please try again.");
                        }

                    })
                    .finally(function() {
                        $scope.searching = false;
                    });
            } else {
                $mdToast.showSimple("Please enter an address");
            }
        };

        $scope.addLocation = function(location) {
            $scope.locations.add({
                label: location.label,
                latitude: location.latitude,
                longitude: location.longitude
            }).then(function() {
                $scope.searchResults = [];
                $scope.searchAddress = "";
                $mdToast.showSimple("Location added");
                $scope.$emit("locations.updated");
                $location.url(
                    "/weather/" + location.latitude + "/" +
                    location.longitude + "?title=" +     encodeURIComponent(location.label)
                );
            });
        };

        $scope.removeLocation = function(index) {
            $scope.locations.data.splice(index, 1);
            $scope.locations.save().then(function() {
                $mdToast.showSimple("Location removed");
                $scope.$emit("locations.updated");
            });
        };

        $scope.$on("refresh", function() {
            $scope.$emit("refresh:complete");
        });

}]);


