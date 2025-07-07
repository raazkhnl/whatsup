const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get messages for a direct chat
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, to: req.params.userId },
                { sender: req.params.userId, to: req.user.id }
            ]
        })
        .sort({ timestamp: 1 })
        .populate('sender', 'username');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get messages for a group chat
router.get('/group/:groupId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            group: req.params.groupId
        })
        .sort({ timestamp: 1 })
        .populate('sender', 'username');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;