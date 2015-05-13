app.controller('ChatCtrl', ['$scope', '$http', '$timeout', function($scope, $http) {
    $scope.messages = [];
    var chat = null;

    $scope.init = function() {
        $http.get('/api/messages/recent').success(function(messages) {
            $scope.messages = messages;

            chat = io.connect(window.location.origin + '/chat');

            chat.on('display-message', function (message) {
                $scope.messages.push(message);
                $scope.$apply();
            });
        });
    };

    $scope.isEmpty = function() {
        return $scope.messages.length === 0;
    };

    $scope.sendMessage = function() {
        if (chat === null) {
            return;
        }

        chat.emit('save-message', $scope.content);
        $scope.content = null;
    };
}]);

app.directive('scroll', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            scope.$watchCollection(attr.scroll, function () {
                $timeout(function () {
                    element[0].scrollTop = element[0].scrollHeight;
                });
            });
        }
    }
});
