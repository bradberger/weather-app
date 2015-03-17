"use strict";

angular.module("weatherApp").filter("dateLocale", ["$filter", function($filter) {

    return function (d, format, locale) {

        locale = locale || false;

        if (locale === "mk") {

            var months = ["Јануари", "Фебруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"],
                days = ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"],
                shortDays = ["Нед", "Пон", "Втр", "Срд", "Чет", "Пет", "Саб"];

            if (format) {
                var str = format;
                str = str.replace(/MMMM/g, months[d.getMonth()]);
                str = str.replace(/yyyy/g, d.getFullYear());
                str = str.replace(/d/g, d.getDate());
                str = str.replace(/EEEE/g, days[d.getDay()]);
                str = str.replace(/EEE/g, shortDays[d.getDay()]);
                return str;
            } else {
                return days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()] + ", " + d.getFullYear();
            }

        }

        return $filter("date")(d, format);

    };

}]);