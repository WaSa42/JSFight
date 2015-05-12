var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    from: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: Date
});

module.exports = mongoose.model('Message', schema);
