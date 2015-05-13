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
    createdAt: {
        type: Date,
        required: true
    },
    online: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('User', schema);
