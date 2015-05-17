var Image = require('./Image');

function Player (game, username, x) {
    this.id             = username;
    this.username       = username;
    this.pressedKeys    = {};
    this.speed          = 20;
    this.life           = 100;

    this.image      = null;
    this.direction  = null;
    this.side       = null;
    this.x          = null;
    this.y          = null;

    this.initialize(game, x);
}

Player.prototype.initialize = function (game, x) {
    this.setImage('idle');
    this.direction = x < game.WIDTH / 2 ? 1 : -1;
    this.side = this.direction;
    this.x = x - this.image.frameWidth / 2;
    this.y = this.getNewY(game);
};

Player.prototype.setImage = function (key) {
    switch (key) {
        case 'idle':
            this.image = new Image({
                key: 'idle',
                src: 'player-idle.png',
                frameWidth: 93,
                frameHeight: 91,
                displayFrame: 0,
                totalFrames: 11,
                fps: 10
            });
            break;

        case 'walk':
            this.image = new Image({
                key: 'walk',
                src: 'player-walk.png',
                frameWidth: 51,
                frameHeight: 111,
                displayFrame: 0,
                totalFrames: 8
            });
            break;

        case 'hit':
            this.image = new Image({
                key: 'hit',
                src: 'player-hit.png',
                frameWidth: 138,
                frameHeight: 96,
                displayFrame: 0,
                totalFrames: 3
            });
            break;

        default:
            break;
    }
};

Player.prototype.input = function (key, down) {
    if (down) {
        this.pressedKeys[key] = true;
    } else {
        delete this.pressedKeys[key];
    }
};

Player.prototype.update = function (game) {
    var updated = false;
    var object = null;
    var target = null;

    // X
    if (37 in this.pressedKeys || 39 in this.pressedKeys) {
        var nextX = this.x;

        if (this.image.key !== 'walk') {
            this.setImage('walk');
            updated = true;
        }

        if (37 in this.pressedKeys) { // Left arrow
            nextX -= this.speed;
            this.direction = -1;
        }

        else { // Right arrow
            nextX += this.speed;
            this.direction = 1;
        }

        // Check for collisions
        object = {
            id: this.id,
            x: nextX,
            y: this.y,
            width: this.image.frameWidth,
            height: this.image.frameHeight
        };

        if (game.collisionDetected(object) === false) {
            this.x = nextX;
            this.image.displayFrame++;
            updated = true;

            if (this.image.displayFrame >= this.image.totalFrames) {
                this.image.displayFrame = 0;
            }
        }
    }

    else if (32 in this.pressedKeys) { // Space bar
        if (this.image.key !== 'hit') {
            this.setImage('hit');
            this.image.displayFrame++;
            updated = true;

            if (this.image.displayFrame >= this.image.totalFrames) {
                this.image.displayFrame = 0;
            }

            object = {
                id: this.id,
                x: this.x,
                y: this.y,
                width: this.image.frameWidth,
                height: this.image.frameHeight
            };

            target = game.collisionDetected(object);

            if (target !== false) {
                target.life -= getRandomBetween(10, 15);

                if (target.life <= 0) {
                    game.stop(this, target);
                }
            }
        }
    }

    else if (this.image.key !== 'idle') {
        this.setImage('idle');
        updated = true;
    }

    // Set final position
    object = {
        id: this.id,
        x: this.x,
        y: this.y,
        width: this.image.frameWidth,
        height: this.image.frameHeight
    };

    target = game.collisionDetected(object);
    var attempt = 0;

    while (target !== false && attempt < 500) {
        object.x += target.x > this.x ? -1 : 1;
        target = game.collisionDetected(object);
        attempt++;
    }

    this.x = object.x;

    // Y
    var newY = this.getNewY(game);

    if (newY !== this.y) {
        this.y = newY;
        updated = true;
    }

    return updated;
};

Player.prototype.getNewY = function (game) {
    return game.HEIGHT - this.image.frameHeight - game.PADDING_BOTTOM
};

function getRandomBetween (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = Player;
