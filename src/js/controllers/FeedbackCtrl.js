"use strict";

angular.module("weatherApp").controller("FeedbackCtrl", ["$scope", "$log", "$http", "$mdDialog", "$mdToast", "$window",
    function($scope, $log, $http, $mdDialog, $mdToast, $window) {

        $scope.$on("refresh", function() {
            $window.location.reload();
        });

        function resetFeedback() {
            $scope.sending = false;
            $scope.feedback = {
                subject: "",
                description: "",
                mood: "",
                email: "",
                name: ""
            };
        }

        resetFeedback();

        var feedbackReceived = function() {
            $mdDialog.show({
                controller: ["$scope", "$mdDialog", function(scope, mdDialog) {
                    scope.language = $scope.language;
                    scope.done = function() {
                        mdDialog.hide();
                    };
                }],
                templateUrl: "templates/feedback-thank-you.html"
            }).then(resetFeedback);
        };

        $scope.send = function() {

            $scope.sending = true;

            var description = $scope.feedback.description || "";
            var subject = ($scope.feedback.subject || "In-app feedback") + " ";
            var mood = ["[", ($scope.feedback.mood || "neutral").toUpperCase(), "]"].join("");
            var version = ["[", $scope.version, "]"].join("");

            if ($scope.feedback.email) {
                description += "\n\nEmail: " + $scope.feedback.email;
            }

            if ($scope.feedback.name) {
                description += "\n\nName: " + $scope.feedback.name;
            }

            $http.post("https://projects.bitola.co/issues.json", {
                issue: {
                    project_id: "weather",
                    subject: [subject, mood, version].join(""),
                    description: description
                }
            })
                .success(function() {
                    $scope.sending = false;
                    feedbackReceived();
                })
                .error(function() {
                    if($scope.online) {
                        $mdToast.showSimple("Error sending your feedback. Please try again.");
                    } else {
                        $mdToast.showSimple("Please connect to the Internet to send your feedback.");
                    }
                })
                .finally(function() {
                    $scope.sending = false;
                });

        };

    }]);
