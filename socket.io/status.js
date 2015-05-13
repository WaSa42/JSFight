var User = require('../models/User');

module.exports = function(io) {
    var users = io.of('/users');

    users.on('connection', function (socket) {
        setUserStatus(socket.request.user.username, true);

        var user = {
            username: socket.request.user.username,
            score: socket.request.user.score
        };

        socket.broadcast.emit('user-connect', user);

        socket.on('disconnect', function () {
            setUserStatus(socket.request.user.username, false);
            socket.broadcast.emit('user-disconnect', user);
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
