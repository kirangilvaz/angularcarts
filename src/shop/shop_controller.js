angular.module("amplify.demo")
    .controller("ShopController", [
        "$scope",
        "$interval",
        "$timeout",
        "shopService",
        "ModalService",
        "httpService",
        "$interval",
        "$location",
        function($scope, $interval, $timeout, shopService, ModalService, httpService, $interval, $location) {
            $scope.filterSelection = 1;
            $scope.items = shopService.allItems;
            shopService.baseUrl = $location.absUrl().substring(0,$location.absUrl().length-4);
                if(!shopService.userAuthkey || !shopService.userEmail){
                    $location.path("/login");
                }


            $scope.shoppingCartItems = [
            ];

            //timer
            var userTimeoutTimerPromise = null;
            var userIdleTime=0;

            var stopTimeoutTimer = function() {
                $interval.cancel(userTimeoutTimerPromise);
            };

            $scope.logout = function(){
                sendCartAbandonmentJson();
                stopTimeoutTimer();
                shopService.cookieId = null;
                shopService.userEmail = null;
                $location.path("/login").search({user: shopService.user});
            };

            var checkUserIdleTime = function(){
                if (userIdleTime >= 120) {
                    if($scope.shoppingCartItems.length === 0){
                        userIdleTime = 0;
                    } else {
                        $scope.logout();
                    }

                }
                userIdleTime++;
            }

            var startTimeoutTimer = function() {
                stopTimeoutTimer();
                userTimeoutTimerPromise = $interval(checkUserIdleTime, 1000);
            };

            startTimeoutTimer();

            $scope.$on('$destroy', function() {
                stopTimeoutTimer();
            });


            $scope.completeOrder = function(){
                var config = {
                    headers: {
                        "Content-Type": "application/JSON",
                        "Authorization" : "Bearer "+shopService.userAuthkey
                    },
                    data: JSON.stringify(shopService.getCartPurchaseItemJson($scope.shoppingCartItems))
                };
                httpService.legacyHttpRequest("POST",shopService.ubxPilotUrl, config).then(function(data){
                    stopTimeoutTimer();
                    shopService.cookieId = null;
                    $location.path("/login").search({user: shopService.user});
                });

            };


            $scope.setFilterSelection = function(selection){
                if(selection === 1){
                    $scope.items = shopService.allItems;
                    $scope.filterSelection = 1;
                } else if(selection === 2){
                    $scope.items = shopService.aItems;
                    $scope.filterSelection = 2;
                }else if(selection === 3){
                    $scope.items = shopService.bItems;
                    $scope.filterSelection = 3;
                }else if(selection === 4){
                    $scope.items = shopService.cItems;
                    $scope.filterSelection = 4;
                }else {
                    $scope.items = shopService.allItems;
                    $scope.filterSelection = 1;
                }
            };


            var sendCartAbandonmentJson = function(){
                if($scope.shoppingCartItems.length > 0){
                    var config = {
                        headers: {
                            "Content-Type": "application/JSON",
                            "Authorization" : "Bearer "+shopService.userAuthkey
                        },
                        data: JSON.stringify(shopService.getCartAbandonmentJson($scope.shoppingCartItems))
                    };
                    httpService.legacyHttpRequest("POST",shopService.ubxPilotUrl, config).then(function(data){

                    });
                }

            };

            $scope.viewProduct = function(product) {

                var config = {
                    headers: {
                        "Content-Type": "application/JSON",
                        "Authorization" : "Bearer "+shopService.userAuthkey
                    },
                    data: JSON.stringify(shopService.getProductViewJson(product))
                };
                httpService.legacyHttpRequest("POST",shopService.ubxPilotUrl, config).then(function(data){

                });

                ModalService.showModal({
                    templateUrl: "modal/product-view.html",
                    controller: "ProductViewController",
                    inputs: {
                        product: product
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function(result) {
                        if(result !== null && $scope.shoppingCartItems.indexOf(product) == -1){
                            $scope.shoppingCartItems.push(product);
                            userIdleTime = 0;
                        }
                    });
                });

            };









        }
    ]
);