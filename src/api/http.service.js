angular.module("amplify.demo")
    .factory("httpService", [
        "$q",
        "api",
        function($q, api) {
            var service = {};

            service.httpRequest = function(type, url, config) {
                var deferred = $q.defer();

                api.request(type, url, config).then(function(response) { // SUCCESS
                    // return data to the calling function
                    deferred.resolve(response);
                }, function(response) { // ERROR
                    deferred.resolve(response);
                });

                return deferred.promise;
            };

            service.legacyHttpRequest = function(type, url, config) {
                var deferred = $q.defer();
                var xmlhttp;

                if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                }

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4) {
                        deferred.resolve(xmlhttp);
                    }
                }

                xmlhttp.open(type, url, true);

                if (config.headers) {
                    xmlhttp.setRequestHeader("Content-Type", config.headers["Content-Type"]);
                    xmlhttp.setRequestHeader("Authorization", config.headers["Authorization"]);
                }

                if (type === "GET") {
                    xmlhttp.send();
                } else if (type === "POST" || type === "PUT" || type === "DELETE") {
                    xmlhttp.send(config.data);
                }

                return deferred.promise;
            };

            return service;
        }]);
