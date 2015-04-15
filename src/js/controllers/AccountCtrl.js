//"use strict";
//
//angular.module("weatherApp").controller("AccountCtrl", ["$scope", "$window", "$log", "$mdToast", "$interval", "Payments",
//    function($scope, $window, $log, $mdToast, $interval, Payments) {
//
//        var updater;
//
//        function reload() {
//            return $scope.payments.load()
//                .then(function() {
//                    $mdToast.showSimple("Account details refreshed");
//                })
//                .catch(function(err) {
//                    if (err.reason === "user_not_authenticated") {
//                        $mdToast.showSimple("Please sign in.");
//                    } else {
//                        $mdToast.showSimple("Error updating account details: " + err.reason || err);
//                    }
//                });
//        }
//
//        $window.payments = $scope.payments = Payments;
//
//        $scope.signIn = function() {
//            $scope.payments.signIn();
//        };
//
//        $scope.subscribe = function() {
//            $scope.payments.getPaymentsInteractive();
//        };
//
//        $scope.editSubscription = function() {
//            $scope.payments.getPaymentsInteractive({ summary: true });
//            // https://monetizejs.com/authorize?client_id={{ payments.appId }}&summary=true
//        };
//
//        $scope.$watch("payments.subscriptions", function(subscriptions) {
//            if (subscriptions) {
//                $window.localStorage.setItem("user.subscriptions", angular.toJson(subscriptions));
//                $scope.$emit("user.account.update");
//            }
//        });
//
//        $scope.$watch("payments.charges", function(charges) {
//            if (charges) {
//                $window.localStorage.setItem("user.charges", angular.toJson(charges));
//                $scope.$emit("user.account.update");
//            }
//        });
//
//
//        $scope.$on("refresh", reload);
//        $scope.$on("$destroy", function() {
//            if($scope.updater) {
//                $interval.cancel(updater);
//            }
//        });
//
//        $scope.updater = $interval(reload, 300000);
//
//}]);
