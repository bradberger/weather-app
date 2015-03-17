"use strict";

angular.module("weatherApp").service("Locations", ["$window", "$q", "$http", "$timeout", function($window, $q, $http, $timeout) {

    function Locations()
    {
        this.data = [];

        this.load = function() {
            var locations = $window.localStorage.getItem("user.locations");
            this.data = locations ? angular.fromJson(locations) : [];
        };

        this.save = function() {

            var self = this;
            var deferred = $q.defer();

            $timeout(function() {
                $window.localStorage.setItem("user.locations", angular.toJson(self.data || []));
                deferred.resolve(self.data);
            });

            return deferred.promise;

        };

        this.add = function(location) {
            var deferred = $q.defer();
            this.data.push(location);
            this.save()
                .then(deferred.resolve)
                .catch(deferred.reject);

            return deferred.promise;

        };

        this.query = function(address) {

            var deferred = $q.defer();

            $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address)
                .success(function(data) {

                    if(data.status !== "OK") {
                        deferred.reject(data);
                        return null;
                    }

                    var addresses = [];
                    angular.forEach(data.results, function(address) {
                        addresses.push({
                            label: address.formatted_address,
                            latitude: address.geometry.location.lat,
                            longitude: address.geometry.location.lng
                        });
                    });
                    deferred.resolve(addresses);

                })
                .catch(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };

        this.load();

    }

    return Locations;


}]);