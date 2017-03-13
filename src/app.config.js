angular.module("amplify.demo")
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('login', {
            url:'/login',
            templateUrl: 'login/login.html',
            controller: 'LoginController'
        }).state('shop',{
            url:'/shop',
            templateUrl: 'shop/shop.html',
            controller: 'ShopController'
        });
    }]);