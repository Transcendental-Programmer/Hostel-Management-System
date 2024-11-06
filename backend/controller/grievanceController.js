import Grievance from '../models/grievances.js';
import Staff from '../models/staff.js';
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
                items_used
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
        const staffs = await Staff.find({}, { _id: 0, user_id: 1, username: 1, full_name: 1, email: 1, department: 1, language_preference: 1 });
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
    const pendingGrievances = await Grievance.countDocuments({ status: 'Pending' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = await Grievance.countDocuments({
      status: 'Resolved',
      updated_at: { $gte: today }
    });

    res.status(200).json({
      totalGrievances,
      pendingGrievances,
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

    const avgResolutionTimeResult = await Grievance.aggregate([
      { $match: { status: 'Resolved' } },
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
      status: 'Pending'
    });

    res.status(200).json({
      staffOnDuty,
      avgResolutionTime: avgResolutionTime.toFixed(1) + ' days',
      urgentMatters,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


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
      return {
        message: `${activity.title} - ${timeAgo} minutes ago`,
        timestamp: activity.updated_at,
      };
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
