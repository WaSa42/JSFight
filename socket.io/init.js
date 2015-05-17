var passportSocketIo    = require('passport.socketio');
var domain              = require('../config/domain');
var game                = require('./game');
var chat                = require('./chat');
var users               = require('./users');

module.exports = function(io, cookieParser, sessionParams) {
    io.set('origins', domain.url);

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: sessionParams.name,
        secret: sessionParams.secret,
        store: sessionParams.store
    }));

    game(io);
    chat(io);
    users(io);
};
