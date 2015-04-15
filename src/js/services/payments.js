"use strict";

angular.module("weatherApp")
    .service("Payments", ["Monetize", "$window", "$q", function(Monetize, $window, $q) {

        function Payments(appId, settings)
        {

            var self = this;

            this.appId = appId;
            this.signedIn = false;
            this.monetize = new Monetize(appId);
            this.token = false;
            this.charges = false;
            this.subscriptions = false;
            this.redirectURL = "";
            this.pricingOptions = ["montly", "yearly"];

            if (settings || false) {
                angular.forEach(settings, function(val, key) {
                    this[key] = val;
                });
            }

            this.getRedirectURL = function(current) {
                return current || false ? $window.location.href : this.redirectURL;
            };

            this.init = function() {

                var deferred = $q.defer();
                this.monetize.init()
                    .then(deferred.resolve)
                    .catch(deferred.reject);
                return deferred.promise;

            };

            this.setToken = function(token) {

                token = token || "";
                $window.localStorage.setItem("user.token", token);
                self.token = token;

                if (token) {
                    self.signedIn = true;
                }

            };

            this.getToken = function() {
                return $window.localStorage.getItem("user.token") || "";
            };

            this.load = function() {

                var deferred = $q.defer();

                this.init()
                .then(function() {
                    self.monetize.getTokenImmediate()
                    .then(function(token) {

                        self.setToken(token);
                        self.getPayments()
                            .then(function(payments) {

                                if(payments.app !== appId) {
                                    throw new Error("Invalid app id. Possible tampering attempt.");
                                }

                                self.charges = payments.chargeOption || false;
                                self.subscriptions = payments.subscriptionOption || false;

                                deferred.resolve({
                                    charges: self.charges,
                                    subscriptions: self.subscriptions
                                });

                            })
                            .catch(deferred.reject);
                    })
                    .catch(deferred.reject);
                })
                .catch(deferred.reject);

                return deferred.promise;

            };

            this.getPayments = function() {

                var deferred = $q.defer();

                self.monetize.getPayments()
                    .then(deferred.resolve)
                    .catch(deferred.reject);

                return deferred.promise;

            };

            this.getPaymentsInteractive = function(additionalOpts) {

                var deferred = $q.defer();

                var options = {
                    redirectURL: self.getRedirectURL(true)
                };

                if(additionalOpts || false) {
                    angular.extend(options, additionalOpts);
                }

                if (angular.isArray(self.pricingOptions)) {
                    options.pricingOptions = self.pricingOptions;
                }

                self.monetize.getPaymentsInteractive(options)
                    .then(deferred.resolve)
                    .catch(deferred.reject);

                return deferred.promise;

            };

            this.signIn = function() {
                return self.monetize.getTokenInteractive({
                    redirectURL: self.getRedirectURL(true),
                    pricingOptions: self.pricingOptions || null
                });
            };

            this.purchase = function($event) {

                if ($event || false) {
                    $event.preventDefault();
                }

                return self.monetize.getPayments();

            };

            this.load();

        }

        return new Payments("r1TkNsXyD2M2zU86");

}]);