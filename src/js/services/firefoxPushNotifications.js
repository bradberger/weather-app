"use strict";

angular.module("weatherApp").service("FirefoxPushNotifications", ["$window", "$q", function($window, $q) {

    function FirefoxPushNotifications() {

        this.enabled = "push" in $window.navigator;

        this.endpoint = $window.localStorage.getItem("user.firefox.notifications");

        this.register = function(force) {

            var self = this;
            var deferred = $q.defer();
            var endpoint = this.getEndpoint();

            force = force || false;

            if (! this.enabled) {
                deferred.reject("Notifications API not available on this platform");
            } else if(endpoint && ! force) {
                deferred.resolve(endpoint);
            } else {
                var req = navigator.push.register();
                req.onsuccess = function(e) {
                    var endpoint = req.result;
                    if (endpoint) {
                        deferred.resolve(self.setEndpoint(endpoint));
                    } else {
                        deferred.reject(e);
                    }
                };
                req.onerror = deferred.reject;
            }

            return deferred.promise;

        };

        this.pushHandler = function(e) {
            this.setEndpoint(e.pushEndpoint);
        };

        this.pushRegisterHandler = function() {
            // Push-register received, need to register my endpoint(s) again
            this.register(true);
        };

        this.setEndpoint = function(endpoint) {
            $window.localStorage.setItem("user.firefox.notifications", endpoint);
            this.endpoint = endpoint;
            return this.endpoint;
        };

        this.getEndpoint = function() {
            return this.endpoint || $window.localStorage.getItem("user.firefox.notifications") || null;
        };

        this.init = function() {

            var self = this;
            var deferred = $q.defer();

            this.register()
                .then(deferred.resolve)
                .catch(deferred.reject);

            // Set up the handler.
            if ($window.navigator.mozSetMessageHandler) {
                $window.navigator.mozSetMessageHandler("push", self.pushHandler);
            }

            if ($window.navigator.mozSetMessageHandler) {
                $window.navigator.mozSetMessageHandler("push-register", self.pushRegisterHandler);
            }

            return deferred.promise;

        };

    }

    return FirefoxPushNotifications;

}]);