"use strict";

angular.module("weatherApp").controller("LocationsCtrl", ["$scope", "$filter", "$window", "$timeout", "$location", "Locations", "$mdToast", "$ionicSlideBoxDelegate",
    function ($scope, $filter, $window, $timeout, $location, Locations, $mdToast, $ionicSlideBoxDelegate) {

        var lang = $scope.getLanguage();

        $scope.locations = new Locations();
        $scope.searchAddress = "";
        $scope.searchResults = [];
        $scope.searching = false;
        $scope.search = function () {

            if ($scope.searchAddress) {
                $scope.searching = true;
                $scope.locations.query($scope.searchAddress, lang)
                    .then(function (data) {
                        $scope.searchResults = data;
                    })
                    .catch(function (err) {

                        $scope.searchResults = [];

                        if (err.status === "ZERO_RESULTS" && $scope.searchAddress.length >= 6) {
                            $mdToast.showSimple("No results found. Try again.");
                            $scope.searchAddress = "";
                        } else {
                            if ($scope.searchAddress.length >= 6) {
                                $mdToast.showSimple(err.status || "Unknown error. Please try again.");
                            }
                        }

                    })
                    .finally(function () {
                        $scope.searching = false;
                    });
            }

        };

        $scope.addLocation = function (location) {
            $scope.locations.add({
                label: location.label,
                latitude: location.latitude,
                longitude: location.longitude
            }).then(function () {
                $scope.searchResults = [];
                $scope.searchAddress = "";
                $mdToast.showSimple("Location added");
            });
        };

        $scope.geolocation = $window.localStorage.getItem("user.geolocation") ? true : false;

        $scope.$watch("geolocation", function () {
            if ($scope.geolocation) {
                $window.localStorage.setItem("user.geolocation", "yes");
            } else {
                $window.localStorage.removeItem("user.geolocation");
            }
        });

        $scope.removeLocation = function (i) {

            $scope.locations.remove(i).then(function () {
                $ionicSlideBoxDelegate.slide(0);
                $mdToast.showSimple("Location removed");
            });

        };


    }]);


