app.controller('ScoresCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    $scope.hide = false;
    $scope.users = [];
    var scores = null;

    $scope.init = function() {
        $http.get('/api/scores').success(function(users) {
            $scope.users = users;

            scores = io.connect(window.location.origin + '/scores');

            scores.on('new-user', function (user) {
                $scope.users.push(user);
                $scope.$apply();
            });

            scores.on('update-user', function (target) {
                $scope.users.forEach(function (user) {
                    if (user.username === target.username) {
                        user.score = target.score;

                        return false;
                    }
                });

                $scope.$apply();
            });
        });
    };

    $rootScope.$on('start-game', function(event, args) {
        $scope.hide = true;

        if (args.apply) {
            $scope.$apply();
        }
    });
}]);
