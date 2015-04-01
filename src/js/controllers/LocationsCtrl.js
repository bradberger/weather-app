
"use strict";

angular.module("weatherApp").controller("LocationsCtrl", ["$scope", "$filter", "$window", "$location", "Locations", "$mdToast",
    function($scope, $filter, $window, $location, Locations, $mdToast) {

        var lang = $scope.getLanguage();

        $scope.locations = new Locations();
        $scope.searchAddress = "";
        $scope.searchResults = [];
        $scope.searching = false;
        $scope.search = function() {
            if ($scope.searchAddress) {
                $scope.searching = true;
                $scope.locations.query($scope.searchAddress, lang)
                    .then(function(data) {
                        $scope.searchResults = data;
                    })
                    .catch(function(err) {

                        $scope.searchResults = [];

                        if (err.status==="ZERO_RESULTS" && $scope.searchAddress.length >= 6) {
                            $mdToast.showSimple("No results found. Try again.");
                            $scope.searchAddress = "";
                        } else {
                            if($scope.searchAddress.length >= 6) {
                                $mdToast.showSimple(err.status || "Unknown error. Please try again.");
                            }
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
            });
        };

        $scope.geolocation = $window.localStorage.getItem("user.geolocation") ? true : false;
        $scope.toggleGeolocation = function() {
           $window.localStorage.setItem(
               "user.geolocation", $scope.geolocation || false ? "yes" : ""
           );
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


