"use strict";

angular.module("weatherApp").service("Forecast", ["$window", "$q", "$http", "$mdToast", function($window, $q, $http, $mdToast) {

    function Forecast(endpoint) {

        var self = this;

        this.endpoint = endpoint || "https://weather.bitola.co/api/v1/weather";
        this.cacheDuration = 900;
        this.limits = {
            daily: false,
            hourly: false,
            currently: false
        };

        this.clearCache = function() {
            var re = /^user\.results/;
            var items = angular.copy($window.localStorage);
            angular.forEach(items, function(v, k) {
                if (re.test(k)) {
                    $window.localStorage.removeItem(k);
                }
            });
        };

        this.clearLocationCache = function(location) {
            $window.localStorage.removeItem(this.getCacheKey(location.latitude, location.longitude));
        };

        this.getCacheKey = function(latitude, longitude) {
            return ["user", "results", latitude.toString().replace(/[^0-9]/g, ""), longitude.toString().replace(/[^0-9]/g, "")].join(".");
        };

        this.saveResult = function(latitude, longitude, result) {
            $window.localStorage.setItem(this.getCacheKey(latitude, longitude), angular.toJson(result));
        };

        this.get = function(lat, long, lang, units) {

            var deferred = $q.defer(),
                latitude = lat.toString(),
                longitude = long.toString(),
                url = this.endpoint +
                        "?latitude=" + latitude +
                        "&longitude=" + longitude +
                        "&language=" + (lang || "en") +
                        "&units=" + (units || "us");

            var cachedResult = $window.localStorage.getItem(this.getCacheKey(lat, long));
            if (cachedResult) {
                var now = (new Date()).valueOf() / 1000;
                cachedResult = angular.fromJson(cachedResult);
                if (! $window.navigator.onLine ||
                    (now - cachedResult.currently.time) <= this.cacheDuration
                ) {
                    cachedResult.currently.time = now;
                    deferred.resolve(cachedResult);
                    return deferred.promise;
                }
            }

            if (! $window.navigator.onLine) {
                $mdToast.showSimple("Please go online to get the forecast");
                deferred.reject("Not online");
                return deferred.promise;
            }

            $http.get(url)
                .success(function(data) {

                    var results = angular.copy(data);

                    self.saveResult(latitude, longitude, results);
                    deferred.resolve(results);

                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };

    }

    return Forecast;

}]);