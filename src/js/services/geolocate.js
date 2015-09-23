"use strict";

angular.module("weatherApp").service("Geolocate", ["$window", "$q", function($window, $q) {

    function Geolocate() {

        var self = this;

        /**
         * @desc This implements the Coordinates spec.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Coordinates
         * @type {{latitude: null, longitude: null, altitude: null, accurracy: null, altitudeAccuracy: null, heading: null}}
         */
        this.coords = {
            latitude: null,
            longitude: null,
            altitude: null,
            accurracy: null,
            altitudeAccuracy: null,
            heading: null
        };

        this.timeout = 30000;
        this.maximumAge = 900000;
        this.age = 0;
        this.watch = false;

        this.init = function(watch) {

            var deferred = $q.defer(),
                watching = watch || false;

            this.age = parseInt($window.localStorage.getItem("user.geolocation.age") || 0);

            var storedCoords = $window.localStorage.getItem("user.geolocation.coords");
            if (storedCoords) {
                this.coords = angular.fromJson(storedCoords);
            }

            self.locate()
                .then(function(position) {
                    self.updatePosition(position);
                    deferred.resolve(position);
                })
                .catch(function(err) {
                    self.onError(err);
                    deferred.reject(err);
                });

            if (watching) {
                this.startWatching();
            } else {
                this.stopWatching();
            }

            return deferred.promise;

        };

        this.startWatching = function() {

            var deferred = $q.defer();

            this.watch = $window.navigator.geolocation.watchPosition(self.updatePosition);
            deferred.resolve(this.watch);

            return deferred.promise;

        };

        this.stopWatching = function() {

            var deferred = $q.defer();

            if (this.watch) {
                $window.navigator.clearWatch(this.watch);
            }

            deferred.resolve(true);

            return deferred.promise;

        };

        this.updatePosition = function(position) {

            var age = (new Date()).valueOf();
            $window.localStorage.setItem("user.geolocation.age", age);
            $window.localStorage.setItem("user.geolocation.coords", angular.toJson(position));

            this.age = age;
            this.error = false;
            this.coords = position;

        };


        this.onError = function(err) {
            this.error = err;
        };

        this.locate = function() {

            var deferred = $q.defer();
            var options = {
                enableHighAccuracy: false,
                timeout: this.timeout || 30000,
                maximumAge: this.maximumAge || 900000
            };

            // Don't call updatePosition here, or else we'll never get a fresh
            // position, since that sets the this.age property.
            if (this.age && ((new Date()).valueOf() - this.age) <= this.maximumAge) {
                if (this.coords.latitude && this.coords.longitude) {
                    deferred.resolve(this.coords);
                    return deferred.promise;
                }
            }

            $window.navigator.geolocation.getCurrentPosition(
                function(position) {
                    self.updatePosition(position.coords);
                    deferred.resolve(position.coords);
                },
                function(err) {
                    self.onError(err);
                    deferred.reject(err.message);
                },
                options
            );

            return deferred.promise;

        };

    }

    return Geolocate;

}]);
