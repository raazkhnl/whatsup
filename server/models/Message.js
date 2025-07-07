const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});

// Ensure a message is either sent to a user or a group, not both
messageSchema.pre('save', function (next) {
    if ((this.to && this.group) || (!this.to && !this.group)) {
        next(new Error('Message must be sent to either a user or a group'));
    }
    next();
});

module.exports = mongoose.model('Message', messageSchema);
