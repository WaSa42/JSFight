app.controller('AuthCtrl', ['$scope', function($scope) {
    $scope.action = '/login';

    $scope.login = function() {
        $scope.action = '/login';
    };

    $scope.register = function() {
        $scope.action = '/register';
    };
}]);
