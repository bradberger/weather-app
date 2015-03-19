"use strict";

angular.module("weatherApp").service("Forecast", ["$window", "$q", "$http", "$mdToast", function($window, $q, $http, $mdToast) {

    function Forecast(apiKey, endpoint) {

        var self = this;

        this.apiKey = apiKey || "APIKEY";
        this.results = angular.fromJson($window.localStorage.getItem("user.results") || "{}");
        this.endpoint = endpoint || "https://weather.bitola.co/api/v1/weather";

        this.limits = {
            daily: false,
            hourly: false,
            currently: false
        };

        this.saveResult = function(latitude, longitude, result) {
            this.results[latitude][longitude] = result;
            $window.localStorage.setItem("user.results", angular.toJson(this.results));
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