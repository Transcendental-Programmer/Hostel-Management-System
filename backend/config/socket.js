import { Server } from 'socket.io';
import MongoDB from './MongoDB.js';
import Messages from '../models/messages.js';
import Chatroom from '../models/chatroom.js';

class SocketService {
  constructor() {
    console.log('Initializing Socket Service...');
    this._io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
  }

  async initListeners() {
    const io = this.io;
    console.log('Initializing Socket Listeners...');

    // Connect to the database
    await MongoDB();

    io.on('connection', (socket) => {
      console.log(`New Socket Connected: ${socket.id}`);

      // Handle user joining a specific channel
      socket.on('joinChannel', ({ chatroomId, userId, senderType }) => {
        socket.join(chatroomId);
        console.log(`User ${userId} of type ${senderType} joined chatroom ${chatroomId}`);
        socket.userId = userId;
        socket.senderType = senderType;
      });

      // Handle sending a message
      socket.on('event:message', async ({ chatroomId, message }) => {
        // Align with frontend message structure
        const messageData = {
          chatroom_id: chatroomId,
          message_content: message.message_content, // Updated to match frontend
          translated_content: message.translated_content || null,
          language: message.language || 'English',
          sender_type: socket.senderType,
          // Store user_id or staff_id based on sender type
          user_id: socket.senderType === 'student' ? socket.userId : null,
          staff_id: socket.senderType === 'staff' ? socket.userId : null,
          createdAt: new Date().toISOString(), // Add timestamp to match frontend
        };

        console.log('New Message Received:', messageData);

        try {
          // Save the message to MongoDB
          const savedMessage = await Messages.create(messageData);
          console.log('Message saved to MongoDB:', savedMessage._id);

          // Update chatroom with the new message's _id
          await Chatroom.findByIdAndUpdate(
            chatroomId,
            { $push: { message_ids: savedMessage._id } },
            { new: true }
          );

          // Emit message with frontend-compatible structure
          const emitData = {
            _id: savedMessage._id,
            message_content: messageData.message_content,
            translated_content: messageData.translated_content,
            sender_type: messageData.sender_type,
            createdAt: messageData.createdAt,
            language: messageData.language,
          };

          io.to(chatroomId).emit('message', emitData);
          console.log(`Message ID ${savedMessage._id} added to Chatroom ${chatroomId}`);
        } catch (error) {
          console.error('Error saving message to MongoDB:', error);
        }
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;