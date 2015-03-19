"use strict";

angular.module("weatherApp").service("Language", ["$window", "$q", "Dictionary", function($window, $q, Dictionary) {

    return function(lang) {


        $window.language = this;

        this.current = false;

        this.lowMemory = true;

        this.defaultLanguage = "en";

        this.languages  = [
            {code: "en", title: "English", english: "English"},
            {code: "mk", title: "Македонски", english: "Macedonian"},
            {code: "bs", title: "Bosanski", english: "Bosnian"},
            {code: "de", title: "Deutsch", english: "German"},
            {code: "es", title: "Español", english: "Spanish"},
            {code: "fr", title: "Français", english: "French"},
            {code: "it", title: "Italiano", english: "Italian"},
            {code: "nl", title: "Nederlands", english: "Dutch"},
            {code: "pl", title: "Polski", english: "Polish"},
            {code: "pt", title: "Portugueses", english: "Portugese"},
            {code: "ru", title: "Русский", english: "Russian"},
            {code: "hr", title: "Hrvatski", english: "Serbian"},
            {code: "al", title: "Shqiptar", english: "Albanian"},
            {code: "sr", title: "Српски", english: "Serbian"}
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