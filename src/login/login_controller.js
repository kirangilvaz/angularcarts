angular.module("amplify.demo")
    .controller("LoginController", [
        "$scope",
        "$interval",
        "$timeout",
        "$location",
        "shopService",
        "httpService",
        function($scope, $interval, $timeout, $location, shopService, httpService) {
            shopService.user = $location.search().user;
            $scope.userAuthkey = null;
            if(shopService.userAuthkeyMap[shopService.user]){
                shopService.userAuthkey = shopService.userAuthkeyMap[shopService.user];
                $scope.userAuthkey = shopService.userAuthkey;

            } else {
                shopService.userAuthkey = null;
                $scope.userAuthkey = null;
            }

            $scope.userEmail = "";
            $scope.setUserEmail = function(){
                shopService.userEmail = $scope.userEmail;
                var config = {
                    headers: {
                        "Content-Type": "application/JSON",
                        "Authorization" : "Bearer "+shopService.userAuthkey
                    },
                    data: JSON.stringify(shopService.getRegistrationJson())
                };
                httpService.legacyHttpRequest("POST",shopService.ubxPilotUrl, config).then(function(data){

                });
            };
        }
    ]
);