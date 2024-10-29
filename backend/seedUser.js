import mongoose from 'mongoose';
import Chatroom from './models/chatroom.js';

// Replace with your MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://raghavgarg:STFU_Nigga@hms.pv4lb.mongodb.net/';

async function addSampleChatrooms() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Sample Chatroom documents
    const sampleChatrooms = [
      {
        grievance_id: "abb74e56-b185-4cc0-8c63-5789400a7db2", // Replace with actual grievance IDs if available
        student_id: "cceb3554-b731-4bc7-b9e1-643c57c86c2b",   // Replace with actual student IDs if available
        staff_id: "8986728b-cc0f-4b6f-abd6-93320d5a82b5",     // Replace with actual staff IDs if available
        message_ids: [],
      },
      {
        grievance_id: "abb74e56-b185-4cc0-8c63-5789400a7db2",
        student_id: "cceb3554-b731-4bc7-b9e1-643c57c86c2b",
        staff_id: "8986728b-cc0f-4b6f-abd6-93320d5a82b5",
        message_ids: [],
      },
      {
        grievance_id: "abb74e56-b185-4cc0-8c63-5789400a7db2",
        student_id: "cceb3554-b731-4bc7-b9e1-643c57c86c2b",
        staff_id: null, // Example where staff_id is not assigned
        message_ids: [],
      },
    ];

    // Insert documents into the Chatroom collection
    const result = await Chatroom.insertMany(sampleChatrooms);
    console.log('Sample Chatrooms Added:', result);
  } catch (error) {
    console.error('Error adding chatrooms:', error);
  } finally {
    mongoose.connection.close();
  }
}

addSampleChatrooms();
