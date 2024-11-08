import Messages from '../models/messages.js';
import Chatroom from '../models/chatroom.js';

// Create a new chatroom
export async function createChatroom(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { grievanceId, studentId, staffId } = req.body; // Ensure you're receiving the necessary data
  console.log('Grievance ID:', grievanceId, 'Student ID:', studentId, 'Staff ID:', staffId);

  try {
    // Check if a chatroom already exists for the same grievance between the student and staff
    const existingChatroom = await Chatroom.findOne({
      grievance_id: grievanceId,
      student_id: studentId,
      staff_id: staffId,
    });

    if (existingChatroom) {
      // Convert Buffer to UUID string
      const formattedChatroom = {
        _id: existingChatroom._id,
        grievance_id: existingChatroom.grievance_id.toString('hex'), // Convert Buffer to hex string
        student_id: existingChatroom.student_id.toString('hex'), // Convert Buffer to hex string
        staff_id: existingChatroom.staff_id.toString('hex'), // Convert Buffer to hex string
        message_ids: existingChatroom.message_ids,
        createdAt: existingChatroom.createdAt,
        updatedAt: existingChatroom.updatedAt,
      };

      // If an existing chatroom is found, return its data
      return res.status(200).json({
        message: 'Chatroom already exists. Please use the existing chatroom.',
        chatroom: formattedChatroom,
      });
    }

    // If no existing chatroom is found, create a new one
    const newChatroom = new Chatroom({
      grievance_id: grievanceId,
      student_id: studentId,
      staff_id: staffId,
    });

    await newChatroom.save();

    // Return the newly created chatroom with formatted UUIDs
    const formattedNewChatroom = {
      _id: newChatroom._id,
      grievance_id: newChatroom.grievance_id.toString('hex'), // Convert Buffer to hex string
      student_id: newChatroom.student_id.toString('hex'), // Convert Buffer to hex string
      staff_id: newChatroom.staff_id.toString('hex'), // Convert Buffer to hex string
      message_ids: newChatroom.message_ids,
      createdAt: newChatroom.createdAt,
      updatedAt: newChatroom.updatedAt,
    };

    return res.status(201).json({
      message: 'Chatroom created successfully.',
      chatroom: formattedNewChatroom,
    });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



//get messages for a particular grievance
export async function getMessages(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.params; // Get the _id from params

  try {
    // Find the chatroom by _id
    const chatroom = await Chatroom.findById(id).populate('message_ids');
    
    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    // Fetch all messages from the Message table using message_ids
    const messages = await Messages.find({ _id: { $in: chatroom.message_ids } });

    // Map messages to only include required fields
    const filteredMessages = messages.map(message => ({
      _id: message._id,
      message_content: message.message_content,
      translated_content: message.translated_content,
      createdAt: message.createdAt,
      language: message.language,
      sender_type: message.sender_type,
    }));

    // Return the filtered messages
    return res.status(200).json(filteredMessages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


