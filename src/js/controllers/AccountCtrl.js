"use strict";

angular.module("weatherApp").controller("AccountCtrl", ["$scope", "$window", "$log", "$mdToast", "$interval", "Payments",
    function($scope, $window, $log, $mdToast, $interval, Payments) {

        var updater;

        function reload() {
            return $scope.payments.load()
                .then(function() {
                    $mdToast.showSimple("Account details refreshed");
                })
                .catch(function(err) {
                    if (err.reason === "user_not_authenticated") {
                        $mdToast.showSimple("Please sign in.");
                    } else {
                        $mdToast.showSimple("Error updating account details: " + err.reason || err);
                    }
                });
        }

        $scope.signIn = function() {
            $scope.payments.signIn();
        };

        $scope.payments = Payments;
        $scope.$on("refresh", reload);
        $scope.$on("$destroy", function() {
            if($scope.updater) {
                $interval.cancel(updater);
            }
        });

        $scope.updater = $interval(reload, 300000);

}]);
