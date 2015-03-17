"use strict";

angular.module("weatherApp").service("Language", ["$window", "$q", "Dictionary", function($window, $q, Dictionary) {

    return function(lang) {

        this.current = false;

        this.lowMemory = true;

        this.defaultLanguage = "en";

        this.languages  = [
            {code: "en", title: "English", english: "English"},
            {code: "mk", title: "Македонски", english: "Macedonian"}
        ];

        this.translator = new Dictionary();

        this.use = function(lang) {
            var self = this;
            return this.translator.use(lang || this.defaultLanguage)
                .then(function() {
                    self.current = lang;
                    $window.localStorage.setItem("user.language", lang);
                });
        };

        this.init = function(lang) {

            var self = this, deferred = $q.defer();

            this.languages.forEach(function(l) {
                // To reduce memory, we'll only load the JSON for language we'll actually need.
                if(self.lowMemory && l.code !== lang) {
                    return true;
                }
                self.translator.add(l.code, "languages/" + l.code + ".json").then(function() {
                    self.use(lang || self.defaultLanguage).then(function() {
                        deferred.resolve(lang);
                    });
                });
            });

            return deferred.promise;

        };

        this.init(lang || $window.localStorage.getItem("user.language"));

    };

}]);