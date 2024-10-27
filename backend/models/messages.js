import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatroom_id: {
    type: mongoose.Schema.Types.UUID,
    ref: 'Chatroom',
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.UUID,
    ref: 'Student',
    required: true,
  },
  message_content: {
    type: String,
    required: true,
  },
  translated_content: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: 'English',
  },
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    required: true,
  },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` fields
});

export default mongoose.model('Message', messageSchema);
