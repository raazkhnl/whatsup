const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

let onlineUsers = new Map();
let userSockets = new Map();

function setupSocket(io) {
    io.on('connection', async (socket) => {
        const token = socket.handshake.auth.token;
        let userId;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
            onlineUsers.set(userId, socket.id);
            userSockets.set(socket.id, userId);

            // Join user to their personal room
            socket.join(userId);

            // Broadcast online users
            io.emit('onlineUsers', Array.from(onlineUsers.keys()));

        } catch (err) {
            socket.disconnect();
            return;
        }

        // Handle sending messages
        socket.on('sendMessage', async ({ to, content, groupId }) => {
            try {
                const message = {
                    sender: userId,
                    content,
                    timestamp: new Date(),
                    to: to || null,
                    group: groupId || null
                };

                // Save message to database
                const savedMessage = await Message.create(message);

                if (groupId) {
                    // Emit to all users in the group
                    io.to(groupId).emit('newMessage', savedMessage);
                } else {
                    // Emit to sender and receiver
                    io.to(userId).emit('newMessage', savedMessage);
                    io.to(to).emit('newMessage', savedMessage);
                }
            } catch (err) {
                console.error('Error sending message:', err);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle joining group chats
        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
        });

        // Handle leaving group chats
        socket.on('leaveGroup', (groupId) => {
            socket.leave(groupId);
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            const userId = userSockets.get(socket.id);
            if (userId) {
                onlineUsers.delete(userId);
                userSockets.delete(socket.id);
                io.emit('onlineUsers', Array.from(onlineUsers.keys()));
            }
        });
    });
}

module.exports = { setupSocket };