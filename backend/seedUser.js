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
        role_id: "role_uuid_1",
        department_id: "department_uuid_1",
      },
      {
        username: "user2",
        password_hash: "hashedpassword2",
        email: "user2@example.com",
        full_name: "User Two",
        role_id: "role_uuid_2",
        department_id: "department_uuid_2",
      },
      {
        username: "user3",
        password_hash: "hashedpassword3",
        email: "user3@example.com",
        full_name: "User Three",
        role_id: "role_uuid_3",
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
