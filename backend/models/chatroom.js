import mongoose from 'mongoose';

const chatroomSchema = new mongoose.Schema({
  grievance_id: {
    type: mongoose.Schema.Types.UUID,
    ref: 'Grievance',
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.UUID,
    ref: 'Student',
    required: true,
  },
  staff_id: {
    type: mongoose.Schema.Types.UUID,
    ref: 'Staff',
    default: null,
  },
  message_ids: [{
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Message',
  }],
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

export default mongoose.model('Chatroom', chatroomSchema);
