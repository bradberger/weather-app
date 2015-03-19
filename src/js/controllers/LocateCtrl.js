"use strict";

angular.module("weatherApp").controller("LocateCtrl", ["$scope", "$window", "$location", "$mdToast", "$q", function($scope, $window, $location, $mdToast, $q) {

    $scope.hasGeolocation = "geolocation" in $window.navigator;
    $scope.error = false;
    $scope.geolocationDenied = false;

    function success(pos) {
        $window.localStorage.setItem("user.position", angular.toJson(pos));
        $location.url(["", "weather", pos.coords.latitude, pos.coords.longitude + "?title=Current%20location"].join("/"));
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
        } else if(! $scope.online) {
            $scope.error = "You need to be online to find your current location.";
        } else {
            $scope.err = err.message || "Unknown error";
        }

    }

    $scope.lastPosition = $window.localStorage.getItem("user.position");
    $scope.useLastPosition = function() {
        if ($scope.lastPosition) {
            success(angular.fromJson($scope.lastPosition));
        }
    };

    $scope.$on("refresh", function() {
        $scope.locate()
            .finally(function() {
                $scope.$emit("refresh:complete");
            });
    });

    var doLocate = function() {
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
        return deferred.promise;
    };

    $scope.locate = function() {
        var loc = doLocate();
        loc.then(success).catch(error);
        return loc;
    };

    $scope.locate();

    var positionWatch;
    if ($scope.hasGeolocation) {
        $window.navigator.geolocation.watchPosition(success);
    }

    $scope.$on("$destroy", function() {
        if(positionWatch) {
            $window.navigator.geolocation.clearWatch(positionWatch);
        }
    });

}]);
