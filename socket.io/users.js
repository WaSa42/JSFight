var User = require('../models/User');

module.exports = function(io) {
    var users = io.of('/users');
    var sockets = {};

    users.on('connection', function (socket) {
        // User status
        setUserStatus(socket.request.user.username, true);
        sockets[socket.request.user.username] = socket;

        var user = {
            username: socket.request.user.username,
            score: socket.request.user.score
        };

        socket.broadcast.emit('user-connect', user);

        socket.on('disconnect', function () {
            setUserStatus(socket.request.user.username, false);
            delete sockets[socket.request.user.username];
            socket.broadcast.emit('user-disconnect', user);
        });

        // Invitations
        socket.on('send-invitation', function (username) {
            if (username in sockets) {
                sockets[username].emit('received-invitation', socket.request.user.username);
            }
        });

        socket.on('cancel-invitation', function (username) {
            if (username in sockets) {
                sockets[username].emit('canceled-invitation', socket.request.user.username);
            }
        });

        socket.on('accept-invitation', function (username) {
            if (username in sockets) {
                sockets[username].emit('accepted-invitation', socket.request.user.username);

                // Prevent other users to invite the two who are playing
                var usernames = [socket.request.user.username, username];

                Object.keys(sockets).forEach(function (target) {
                    if (usernames.indexOf(target) === -1) {
                        sockets[target].emit('users-in-game', usernames);
                    }
                });
            }
        });
    });
};

function setUserStatus(username, online) {
    User.findOne({
            username: username
        }, function (err, doc) {
            if (err) {
                console.log(err);
                return;
            }

            doc.online = online;
            doc.save();
        }
    );
}
