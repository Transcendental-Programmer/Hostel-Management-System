<<<<<<< HEAD
const mongoose = require("mongoose");
const User = require("./models/users"); // Adjust path if needed
const MongoDB = require("./config/MongoDB"); // Assumes db.js handles the MongoDB connection

const seedUsers = async () => {
  try {
    await MongoDB();

    const users = [
      {
        username: "user1",
        password_hash: "hashedpassword1",
        email: "user1@example.com",
        full_name: "User One",
        role: "role_uuid_1",
        department_id: "department_uuid_1",
      },
      {
        username: "user2",
        password_hash: "hashedpassword2",
        email: "user2@example.com",
        full_name: "User Two",
        role: "role_uuid_2",
        department_id: "department_uuid_2",
      },
      {
        username: "user3",
        password_hash: "hashedpassword3",
        email: "user3@example.com",
        full_name: "User Three",
        role: "role_uuid_3",
        department_id: "department_uuid_3",
      },
    ];

    await User.insertMany(users);
    console.log("Users added successfully!");
  } catch (error) {
    console.error("Error adding users:", error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = seedUsers;
=======
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
>>>>>>> d9f5190202f74e21b65c61e05193f26624aa95c7
