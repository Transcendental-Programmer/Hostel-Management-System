
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatroom_id: {
    type: mongoose.Schema.Types.ObjectId, // Change to ObjectId
    ref: 'Chatroom',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.UUID, // For students
    ref: 'User', // Assuming you have a User model for students
    default: null, // Set to null if the sender is staff
  },
  staff_id: {
    type: mongoose.Schema.Types.UUID, // For staff
    ref: 'Staff', // Assuming you have a separate Staff model
    default: null, // Set to null if the sender is a user (student)
  },
  sender_type: {
    type: String,
    enum: ['student', 'staff'],
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
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Message', messageSchema);