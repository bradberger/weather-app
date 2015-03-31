"use strict";

angular.module("weatherApp").service("Forecast", ["$window", "$q", "$http", "$mdToast", function($window, $q, $http, $mdToast) {

    function Forecast(endpoint) {

        var self = this;

        this.results = angular.fromJson($window.localStorage.getItem("user.results") || "{}");
        this.endpoint = endpoint || "https://weather.bitola.co/api/v1/weather";
        this.cacheDuration = 900;
        this.limits = {
            daily: false,
            hourly: false,
            currently: false
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

                    // Since first hourly is actually *now*, let's use now instead,
                    // thus eliminating the need for one tab.
                    results.hourly.data[0] = results.currently;

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