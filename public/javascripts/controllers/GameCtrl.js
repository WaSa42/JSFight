app.controller('GameCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.hide = true;

    $rootScope.$on('start-game', function(event, args) {
        $rootScope.inGame = true;
        $scope.hide = false;

        if (args.apply) {
            $scope.$apply();
        }
    });
}]);
