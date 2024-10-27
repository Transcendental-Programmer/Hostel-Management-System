import { Server } from 'socket.io';
import MongoDB from './MongoDB.js';
import Messages from '../models/messages.js';

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
        socket.userId = userId; // Store userId in socket
        socket.senderType = senderType; // Store senderType in socket
      });

      // Handle sending a message
      socket.on('event:message', async ({ chatroomId, message }) => {
        const data = {
          messageText: message.messageText,
          media: message.media,
          userId: socket.userId,
          senderType: socket.senderType, // Include sender type
          chatroomId,
        };

        console.log('New Message Received:', message.messageText);

        // Emit the message to the specific chatroom
        io.to(chatroomId).emit('message', data);

        // Save the message to MongoDB
        try {
          const messageData = {
            chatroom_id: chatroomId,
            message_content: message.messageText,
            translated_content: message.translatedContent || null,
            language: message.language || 'English',
            // Store user_id or staff_id based on sender type
            user_id: socket.senderType === 'student' ? socket.userId : null,
            staff_id: socket.senderType === 'staff' ? socket.userId : null,
          };

          const savedMessage = await Messages.create(messageData);
          console.log('Message saved to MongoDB:', savedMessage._id);
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
