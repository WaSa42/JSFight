app.controller('UsersCtrl', ['$scope', '$http', '$timeout', function($scope, $http) {
    $scope.users = [];
    var socket = null;

    var isUserOnline = function (target) {
        var online = false;

        $scope.users.forEach(function (user, index) {
            if (user.username === target.username) {
                online = index;
                return false;
            }
        });

        return online;
    };

    $scope.init = function () {
        $http.get('/api/users/online').success(function (users) {
            $scope.users = users;

            socket = io.connect(window.location.origin + '/users');

            socket.on('user-connect', function (user) {
                if (isUserOnline(user) === false) {
                    $scope.users.push(user);
                    $scope.$apply();
                }
            });

            socket.on('user-disconnect', function (user) {
                var index = isUserOnline(user);

                if (index !== false) {
                    $scope.users.splice(index, 1);
                    $scope.$apply();
                }
            });
        });
    };

    $scope.isEmpty = function() {
        return $scope.users.length === 0;
    };
}]);
