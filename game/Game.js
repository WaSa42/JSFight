var Player = require('../game/Player');
var User = require('../models/User');

function Game (namespace, room, usernames) {
    this.WIDTH          = 768;
    this.HEIGHT         = 384;
    this.PADDING_BOTTOM = 20;

    this.namespace  = namespace;
    this.room       = room;
    this.objects    = [];

    this.start(usernames);
}

Game.prototype.start = function (usernames) {
    var widthPerPlayer = this.WIDTH / usernames.length;

    // Initialize players
    for (var i = 0; i < usernames.length; i++) {
        var x = i * widthPerPlayer + widthPerPlayer / 2;
        this.objects.push(new Player(this, usernames[i], x));
    }
};

Game.prototype.input = function (username, key, down) {
    this.objects.forEach(function (object) {
        if (object instanceof Player && object.username === username) {
            object.input(key, down);
            return false;
        }
    });

    this.update();
};

Game.prototype.update = function () {
    var updated = false;
    var self = this;

    this.objects.forEach(function (object) {
        if (typeof object.update === 'function') {
            if (object.update(self)) {
                updated = true;
            }
        }
    });

    if (updated) {
        this.render();
    }
};

Game.prototype.render = function () {
    this.namespace.to(this.room).emit('update-game', this.objects);
};

Game.prototype.collisionDetected = function (object1) {
    var collision = false;

    this.objects.forEach(function (object2) {
        if (object1.id !== object2.id) {
            if (object1.x <= object2.x + object2.image.frameWidth &&
                object1.x + object1.width + 5 >= object2.x &&
                object1.y <= object2.y + object2.image.frameHeight &&
                object1.height + object1.y >= object2.y
            ) {
                collision = object2;
                return false;
            }
        }
    });

    return collision;
};

Game.prototype.stop = function (winner, looser) {
    User.findOne({
        username: looser.username
    }, function (err, doc){
        doc.score += 100 - winner.life;
        doc.save();
    });

    User.findOne({
        username: winner.username
    }, function (err, doc){
        doc.score += 100;
        doc.save();
    });

    this.namespace.to(this.room).emit('stop-game');
};

module.exports = Game;
