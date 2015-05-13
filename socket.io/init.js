var passportSocketIo    = require('passport.socketio');
var chat                = require('./chat');
var status              = require('./status');

module.exports = function(io, cookieParser, sessionParams) {
    io.set('origins', 'http://localhost:3000');

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: sessionParams.name,
        secret: sessionParams.secret,
        store: sessionParams.store
    }));

    status(io);
    chat(io);
};
