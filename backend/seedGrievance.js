import mongoose from 'mongoose';
import Grievance from './models/grievances.js';
import Student from './models/student.js'; // Adjust the path as needed

// Replace with your MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://raghavgarg:STFU_Nigga@hms.pv4lb.mongodb.net/';

async function createSampleGrievance() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');


    // Sample Grievance document
    const sampleGrievance = new Grievance({
      user_id: "cceb3554-b731-4bc7-b9e1-643c57c86c2b",
      category: 'Technical Issue',
      title: 'Unable to access course materials',
      description: 'I am facing an issue accessing the course materials for CS101.',
      urgency_level: 'High',
      status: 'Pending',
      voice_input_url: 'https://example.com/voice.mp3',
      language_detected: 'English',
      items_used: ['Browser', 'VPN']
    });

    // Save the grievance to MongoDB
    const result = await sampleGrievance.save();
    console.log('Sample Grievance Added:', result);
  } catch (error) {
    console.error('Error creating grievance:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSampleGrievance();
