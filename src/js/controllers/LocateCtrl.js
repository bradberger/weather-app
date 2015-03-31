"use strict";

angular.module("weatherApp").controller("LocateCtrl", ["$scope", "$window", "$location", "$mdToast", "$q", "Geolocate",
    function ($scope, $window, $location, $mdToast, $q, Geolocate) {

        $scope.hasGeolocation = "geolocation" in $window.navigator;
        $scope.error = false;
        $scope.geolocationDenied = false;


        var locate = new Geolocate();

        function success(coords) {
            $location.url(["", "weather", coords.latitude, coords.longitude + "?title=Current%20location"].join("/"));
        }

        function error(err) {

            var denied = err.message && err.message.indexOf("denied") > -1;
            if (denied) {
                $window.localStorage.setItem("user.geolocation.denied", (new Date()).valueOf() / 100);
            }

            if (denied) {
                $mdToast.showSimple("Geolocation is disabled");
                $scope.geolocationDenied = true;
                $scope.error = false;
            } else if (!$scope.online) {
                $scope.error = "You need to be online to find your current location.";
            } else {
                $scope.err = err.message || "Unknown error";
            }

        }
        
        var doLocate = function () {
            var deferred = $q.defer();
            locate.locate()
                .then(deferred.resolve)
                .catch(deferred.reject);
            return deferred.promise;
        };

        $scope.locate = function () {
            var loc = doLocate();
            loc.then(success).catch(error);
            return loc;
        };

        $scope.locate();

    }]);
