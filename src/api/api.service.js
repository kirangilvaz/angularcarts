angular.module("amplify.demo")
    .factory("api", [
        "$http",
        "$q",
        "$window",
        "$location",
        function($http, $q, $window, $location) {
            var api = {
                errorLog: [],
                isAuthorized: false,
                eventSourceInitDict : { headers: {"Access-Control-Allow-Origin":"*" } }
            };


            /****** Authentication ******/

            // Set the HTTP authentication
            api.setToken = function(token) {
                if (token === null) { // Clear the authentication
                    delete $window.sessionStorage.token;
                    $http.defaults.headers.common.Authorization = null;
                    api.eventSourceInitDict.headers.Authorization = null;
                    api.isAuthorized = false;
                } else {
                    $window.sessionStorage.token = token;
                    $http.defaults.headers.common.Authorization = "Session " + token;
                    api.eventSourceInitDict.headers.Authorization = "Session " + token;
                    api.isAuthorized = true;
                }
            };

            // find the session token
            api.getToken = function() {
                var token;

                // check for token in the URL and remove parameter
                token = $location.search().token;
                $location.search('token', null)

                // token not found in URL, check for it in local storage
                if (!angular.isDefined(token) || token === null) {
                    token =  $window.sessionStorage.token;
                }

                return token === "undefined" ? undefined : token;
            };


            /****** API Requests ******/

            // Generate a stack trace array
            api.getStackTrace = function () {
                var stack;

                try {
                    throw new Error("");
                } catch (error) {
                    stack = error.stack || "";
                }

                stack = stack.split("\n").map(function (line) {
                    return line.trim();
                });

                return stack.splice(stack[0] === "Error" ? 2 : 1);
            };

            // Perform the actual HTTP request
            api.request = function(method, url, config) {
                var deferred = $q.defer();

                // Figure out what's requesting the data
                //console.log(api.getStackTrace().join('\n'));

                config = config || {};
                config.method = method; // "GET", "POST", "DELETE", etc
                config.url = url;
                //config.cache = false; // do not cache

                $http(config).then(function (response) {
                    //update request headers with new token
                    var token = response.headers("authorization");
                    if(token !== null){
                        token = token.replace("Session ", "");
                        api.setToken(token);
                    }
                    // Resolve the promise with the HTTP response object
                    deferred.resolve(response);

                }, function(response) {
                    //console.log("['+error.status+'] API ERROR", error);
                    api.errorLog.push(response);

                    // Reject the promise with the HTTP response object
                    deferred.reject(response);

                });

                return deferred.promise;
            };

            // Perform a POST request
            api.post = function(url, data, config) {
                config = config || {};

                // Add POST data
                config.data = data;

                // Perform the HTTP POST and return the promise
                return api.request("POST", url, config);
            };

            // Perform a GET request
            api.get = function(url, params, config) {
                config = config || {};
                config.params = angular.extend(config.params || {}, params || {});

                // Perform the HTTP GET and return the promise
                return api.request("GET", url, config);
            };

            // Perform a PUT request
            api.put = function(url, data, config) {
                config = config || {};

                // Add PUT data
                config.data = data;

                // Perform the HTTP PUT and return the promise
                return api.request("PUT", url, config);
            };

            // Perform a PATCH request
            api.patch = function(url, data, config) {
                config = config || {};

                // Add PATCH data
                config.data = data;

                // Perform the HTTP PUT and return the promise
                return api.request("PATCH", url, config);
            };

            // Perform a DELETE request
            api.delete = function(url, data, config) {
                config = config || {};

                // Add DELETE data
                config.data = data;

                return api.request("DELETE", url, config);
            };

            return api;
        }
    ]);
