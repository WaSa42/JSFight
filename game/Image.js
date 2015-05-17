function Image (options) {
    this.key            = options.key;
    this.src            = options.src;
    this.frameWidth     = options.frameWidth;
    this.frameHeight    = options.frameHeight;
    this.displayFrame   = options.displayFrame;
    this.totalFrames    = options.totalFrames;
    this.fps            = options.fps;
}

module.exports = Image;
