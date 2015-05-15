app.controller('UsersCtrl', ['$rootScope', '$scope', '$http', '$timeout', function($rootScope, $scope, $http) {
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

    var startGame = function (username, apply) {
        // Cancel invitations
        $scope.users.forEach(function (user) {
            if ('invitation' in user) {
                $scope.cancelInvitation(user);
            }
        });

        // Start game
        $rootScope.$emit('start-game', {
            username: username,
            apply: apply
        });
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

            socket.on('received-invitation', function (username) {
                var index = isUserOnline({
                    username: username
                });

                if (index !== false) {
                    $scope.users[index].invitation = 'received';
                    $scope.$apply();
                }
            });

            socket.on('canceled-invitation', function (username) {
                var index = isUserOnline({
                    username: username
                });

                if (index !== false) {
                    delete $scope.users[index].invitation;
                    $scope.$apply();
                }
            });

            socket.on('accepted-invitation', function (username) {
                var index = isUserOnline({
                    username: username
                });

                if (index !== false) {
                    delete $scope.users[index].invitation;
                    startGame(username, true);
                }
            });

            socket.on('users-in-game', function (usernames) {
                usernames.forEach(function (username) {
                    var index = isUserOnline({
                        username: username
                    });

                    if (index !== false) {
                        $scope.users[index].invitation = 'in-game';
                        $scope.$apply();
                    }
                });
            });
        });
    };

    $scope.isEmpty = function() {
        return $scope.users.length === 0;
    };

    $scope.sendInvitation = function (user) {
        socket.emit('send-invitation', user.username);
        user.invitation = 'sent';
    };

    $scope.cancelInvitation = function (user) {
        socket.emit('cancel-invitation', user.username);
        delete user.invitation;
    };

    $scope.acceptInvitation = function (user) {
        socket.emit('accept-invitation', user.username);
        delete user.invitation;
        startGame(user.username, false);
    };

    $scope.inGame = function() {
        return $rootScope.inGame;
    };
}]);
