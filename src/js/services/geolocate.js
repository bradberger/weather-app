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

        this.watch = false;

        this.init = function(watch) {

            var deferred = $q.defer(),
                watching = watch || false;

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
            this.error = false;
            this.coords = position;
        };

        this.onError = function(err) {
            this.error = err;
        };

        this.locate = function() {

            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            var deferred = $q.defer();

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