app.controller('GameCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.hide = true;
    var socket = null;

    $rootScope.$on('start-game', function(event, args) {
        $rootScope.inGame = true;
        $scope.hide = false;

        socket = io.connect(window.location.origin + '/game');

        var canvas = document.getElementById('game');
        var context = canvas.getContext('2d');
        var loadedImages = 0;

        var images  = {
            'player-idle.png': new Image(),
            'player-walk.png': new Image(),
            'player-hit.png' : new Image()
        };

        var keys = Object.keys(images);

        var onImageLoad = function () {
            loadedImages++;

            if (loadedImages === keys.length) {
                if (args.apply) {
                    socket.emit('join-game', args.username);
                    $scope.$apply();
                } else {
                    socket.emit('start-game', args.username);
                }
            }
        };

        keys.forEach(function (key) {
            images[key].onload = onImageLoad;
            images[key].src = '/images/game/' + key;
        });

        var intervals = [];

        socket.on('stop-game', function () {
            document.location.href = '/lobby';
        });

        socket.on('update-game', function (objects) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            intervals.forEach(function (interval) {
                clearInterval(interval);
            });

            intervals = [];

            objects.forEach(function (object) {
                draw(context, images, object);

                if (typeof object.image.fps !== 'undefined') {
                    object.image.displayFrame = getRandomBetween(0, object.image.totalFrames - 1);

                    intervals.push(setInterval(function () {
                        draw(context, images, object);
                    }, 1000 / object.image.fps));
                }

                if (typeof object.username !== 'undefined') {
                    context.beginPath();

                    if (object.side > 0) {
                        context.rect(10, 10, 100, 10);
                    } else {
                        context.rect(canvas.width - 110, 10, 100, 10);
                    }

                    context.fillStyle = 'red';
                    context.fill();

                    context.beginPath();

                    if (object.side > 0) {
                        context.rect(10, 10, object.life, 10);
                    } else {
                        context.rect(canvas.width - 110, 10, object.life, 10);
                    }

                    context.fillStyle = 'green';
                    context.fill();
                }
            });
        });

        addEventListener('keydown', function (e) {
            socket.emit('player-keydown', e.keyCode);
        }, false);

        addEventListener('keyup', function (e) {
            socket.emit('player-keyup', e.keyCode);
        }, false);
    });
}]);

function draw (context, images, object) {
    context.clearRect(
        object.x,
        object.y,
        object.image.frameWidth,
        object.image.frameHeight
    );

    context.drawImage(
        images[object.image.src],
        object.image.displayFrame * object.image.frameWidth,
        object.direction > 0 ? 0 : object.image.frameHeight,
        object.image.frameWidth,
        object.image.frameHeight,
        object.x,
        object.y,
        object.image.frameWidth,
        object.image.frameHeight
    );

    object.image.displayFrame++;

    if (object.image.displayFrame >= object.image.totalFrames) {
        object.image.displayFrame = 0;
    }
}

function getRandomBetween (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
