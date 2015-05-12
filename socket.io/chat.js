var Message = require('../models/Message');

module.exports = function(io) {
    var chat = io.of('/chat');

    chat.on('connection', function(socket) {
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

                chat.emit('display-message', message);
            });
        });
    });
};
