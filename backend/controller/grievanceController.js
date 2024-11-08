import Grievance from '../models/grievances.js';
import Staff from '../models/staff.js';
import Student from '../models/student.js';
import { sendStaffAssignedNotification } from '../utils/communicationUtils.js';
// Create a new grievance
export const createGrievance = async (req, res) => {
  try {
    const { user_id, staff_id, title, description, category, urgency_level, items_used } = req.body;
    const grievance = await Grievance.create({
      user_id,
      staff_id,
      title,
      description,
      category,
      urgency_level,
      status: "pending",
      voice_input_url: null,
      language_detected: "English",
      items_used,
    });
    res.status(201).json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to create grievance");
  }
};

// Get all grievances (for wardens) 
export const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.json(grievances).status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to get grievances");
  }
};
// for staff and warden dashboard
export const getOpenGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.aggregate([
      {
        $match: {
          status: { $regex: /^(Pending|Completed)$/i }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'student_info'
        }
      },
      {
        $project: {
          grievance_id: 1,
          user_id: 1,
          staff_id: 1,
          category: 1,
          title: 1,
          description: 1,
          submission_timestamp: 1,
          urgency_level: 1,
          status: 1,
          voice_input_url: 1,
          language_detected: 1,
          items_used: 1,
          created_at: 1,
          updated_at: 1,
          room_number: { $arrayElemAt: ['$student_info.room_number', 0] }
        }
      }
    ]);

    res.status(200).json(grievances);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to get grievances");
  }
};


// Get all grievances submitted by a user
export const getGrievancesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const grievances = await Grievance.find({ user_id });
    res.json(grievances).status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to get grievances");
  }
};
// Get a grievance by ID
export const getGrievanceById = async (req, res) => {
  try {
    const { grievance_id } = req.params;
    const grievance = await Grievance.findOne({ grievance_id });
    res.json(grievance).status(200);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to get grievance");
  }
};

// Update a grievance by ID
export const updateGrievanceById = async (req, res) => {
  try {
    const { grievance_id, status, staff_id, title, description, urgency_level, items_used } = req.body;
    console.log(`Updating grievance ${grievance_id}`);
    const grievance = await Grievance.findOneAndUpdate(
      { grievance_id },
      {
        status: status.toLowerCase(), // Ensure status is lowercase
        staff_id,
        title,
        description,
        urgency_level,
        items_used,
        updated_at: new Date()
      },
      { new: true }
    );
    res.status(200).json(grievance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to update grievance");
  }
};


// Delete a grievance by ID
export const deleteGrievanceById = async (req, res) => {
  try {
    const { grievance_id } = req.body;
    await Grievance.findOneAndDelete({ grievance_id });
    res.status(200).json(`Grievance ${grievance_id} deleted successfully`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to delete grievance");
  }
};


// Get all staff members
export const getStaff = async (req, res) => {
  console.log("Getting staff members");

  try {
    const staffs = await Staff.find({}, { _id: 0, user_id: 1, username: 1, full_name: 1, email: 1, department: 1, language_preference: 1, is_active: 1, phone_number: 1 });
    // console.log("staffs: ", staffs);
    res.status(200).json(staffs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error: Failed to get staff members");
  }
};


// Assign staff to a grievance
export const assignStaff = async (req, res) => {
  try {
    const { grievance_id, staff_id } = req.body;

    // Find the grievance by ID
    const grievance = await Grievance.findOne({ grievance_id });

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Update the staff_id field
    grievance.staff_id = staff_id;
    await grievance.save();
    res.status(200).json(grievance);

    const staff = await Staff.findOne({ user_id: staff_id });

    if (staff) {
      // Send email notification to the user
      const student = await Student.findOne({ user_id: grievance.user_id });
      await sendStaffAssignedNotification(student.email, staff.full_name, grievance.grievance_id, student.full_name);
      console.log("Staff assigned successfully");
    }


  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error: Failed to assign staff' });
  }
};


//apis for admin dashboard
// Get quick stats for the admin dashboard
export const getQuickStats = async (req, res) => {
  console.log("Getting quick stats");

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const totalGrievances = await Grievance.countDocuments();
    const pendingGrievances = await Grievance.countDocuments({ status: { $regex: '^pending$', $options: 'i' } });
    const completedGrievances = await Grievance.countDocuments({ status: { $regex: '^completed$', $options: 'i' } });
    const closedGrievances = await Grievance.countDocuments({ status: { $regex: '^closed$', $options: 'i' } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = await Grievance.countDocuments({
      status: { $regex: '^closed$', $options: 'i' },
      updated_at: { $gte: today }
    });

    res.status(200).json({
      totalGrievances,
      pendingGrievances,
      completedGrievances,
      closedGrievances,
      resolvedToday,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Get an overview of staff members
export const getStaffOverview = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const staffOnDuty = await Staff.countDocuments({ is_active: true });
    const staffOnLeave = await Staff.countDocuments({ is_active: false });

    const avgResolutionTimeResult = await Grievance.aggregate([
      { $match: { status: { $regex: '^closed$', $options: 'i' } } },
      {
        $project: {
          resolutionTime: { $subtract: ["$updated_at", "$submission_timestamp"] }
        }
      },
      { $group: { _id: null, avgResolutionTime: { $avg: "$resolutionTime" } } }
    ]);
    const avgResolutionTime = avgResolutionTimeResult[0]
      ? avgResolutionTimeResult[0].avgResolutionTime / (1000 * 60 * 60 * 24) // convert milliseconds to days
      : 0;

    const urgentMatters = await Grievance.countDocuments({
      urgency_level: { $in: ['High', 'Critical'] },
      status: { $regex: '^pending$', $options: 'i' }
    });

    res.status(200).json({
      staffOnDuty,
      staffOnLeave,
      avgResolutionTime: avgResolutionTime.toFixed(1) + ' days',
      urgentMatters,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Get recent activity for the admin dashboard
// Get recent activity for the admin dashboard
export const getRecentActivity = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const recentActivities = await Grievance.find()
      .sort({ updated_at: -1 })
      .limit(5)
      .select("title updated_at status");

    // Here you can customize the activity messages based on the data
    const activities = recentActivities.map(activity => {
      const activityTime = new Date(activity.updated_at);
      const timeAgo = Math.floor((new Date() - activityTime) / (1000 * 60)); // in minutes

      // Convert status to lowercase for case-insensitive comparison
      const status = activity.status.toLowerCase();

      // Add status-based message
      let statusMessage;
      switch (status) {
        case 'completed':
          statusMessage = 'Grievance resolved';
          break;
        case 'pending':
          statusMessage = 'New grievance filed';
          break;
        case 'closed':
          statusMessage = 'Grievance closed';
          break;
        default:
          statusMessage = 'Status unknown';
          break;
      }

      return {
        message: `${activity.title} - ${statusMessage} - ${timeAgo} mins ago`,
        timestamp: activity.updated_at,
      };
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get performance data
export const getPerformanceData = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const performanceData = await Grievance.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updated_at" } },
          resolved: { $sum: { $cond: [{ $regexMatch: { input: "$status", regex: /^closed$/i } }, 1, 0] } },
          pending: { $sum: { $cond: [{ $regexMatch: { input: "$status", regex: /^pending$/i } }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          resolved: 1,
          pending: 1
        }
      },
      { $sort: { name: 1 } }  // Sort by date
    ]);

    res.status(200).json(performanceData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

