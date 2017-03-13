angular.module("amplify.demo")
    .controller('ProductViewController', function($scope, product, close) {

        $scope.product = product;
    $scope.close = function(result) {
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };

});