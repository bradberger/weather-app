"use strict";

angular.module("weatherApp").service("Forecast", ["$window", "$q", "$http", "$mdToast", function($window, $q, $http, $mdToast) {

    function Forecast(apiKey, endpoint) {

        var self = this;

        this.apiKey = apiKey || "APIKEY";
        this.results = angular.fromJson($window.localStorage.getItem("user.results") || "{}");
        this.endpoint = endpoint || "https://weather.bitola.co/forecast";

        this.limits = {
            daily: 6,
            hourly: 8,
            currently: false
        };

        this.saveResult = function(latitude, longitude, result) {
            this.results[latitude][longitude] = result;
            $window.localStorage.setItem("user.results", angular.toJson(this.results));
        };

        this.get = function(lat, long) {

            var deferred = $q.defer(),
                latitude = lat.toString(),
                longitude = long.toString(),
                coords = [latitude, longitude].join(","),
                url = [this.endpoint, this.apiKey, coords].join("/");

            if (! this.results[latitude]) {
                this.results[latitude] = {};
            }

            if (! this.results[latitude][longitude]) {
                this.results[latitude][longitude] = false;
            }

            if (! $window.navigator.onLine) {
                if (this.results[latitude][longitude]) {
                    deferred.resolve(this.results[latitude][longitude]);
                } else {
                    $mdToast.showSimple("Please go online to get the forecast");
                    deferred.reject("Not online");
                }
                return deferred.promise;
            }

            $http.get(url)
                .success(function(data) {

                    var results = {
                        currently: angular.copy(data.currently),
                        daily: angular.copy(data.daily),
                        hourly: angular.copy(data.hourly)
                    };

                    if (self.limits.daily) {
                        results.daily.data = results.daily.data.splice(0, self.limits.daily - 1);
                    }

                    if (self.limits.hourly) {
                        results.hourly.data = results.hourly.data.splice(0, self.limits.hourly - 1);
                    }

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