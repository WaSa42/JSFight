var User = require('../models/User');

module.exports = function(io) {
    var users = io.of('/users');

    users.on('connection', function(socket) {
        socket.on('save-message', function(content) {
            var message = new Message({
                from: socket.request.user.username,
                content: content,
                createdAt: new Date()
            });

            message.save(function(err) {
                if (err) {
                    console.log(err);
                    return;
                }

                users.emit('display-message', message);
            });
        });
    });
};
