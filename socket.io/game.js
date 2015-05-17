var Game = require('../game/Game');

module.exports = function(io) {
    var game = io.of('/game');
    var games = {};

    game.on('connection', function (socket) {
        socket.on('start-game', function (username) {
            joinGame(username);

            games[socket.room] = new Game(game, socket.room, [socket.request.user.username, username]);
        });

        socket.on('join-game', function (username) {
            joinGame(username);

            if (socket.room in games) {
                games[socket.room].render();
            }
        });

        var joinGame = function (username) {
            socket.room = getRoomName(socket.request.user.username, username);
            socket.join(socket.room);
        };

        socket.on('player-keydown', function(key) {
            if (socket.room in games) {
                games[socket.room].input(socket.request.user.username, key, true);
            }
        });

        socket.on('player-keyup', function(key) {
            if (socket.room in games) {
                games[socket.room].input(socket.request.user.username, key, false);
            }
        });

        socket.on('disconnect', function () {
            socket.leave(socket.room);
            game.to(socket.room).emit('stop-game');
        });
    });
};

function getRoomName (username1, username2) {
    return [username1, username2].sort().join('-');
}
