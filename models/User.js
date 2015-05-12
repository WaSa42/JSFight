var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: Date
});

module.exports = mongoose.model('User', schema);
