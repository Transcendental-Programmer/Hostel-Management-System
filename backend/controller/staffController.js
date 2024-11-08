import Grievance from "../models/grievances.js";
import Staff from "../models/staff.js";

export const getStaffHistory = async (req, res) => {
    const staffId= req.params.staff_id;
    const allHistory = await Grievance.find({staff_id: staffId, status: "closed"});
    res.json(allHistory);
};

export const getActiveGrievances = async (req, res) => {
    const staffId = req.params.staff_id;
    const allActive = await Grievance.find({
        staff_id: staffId,
        status: { $in: ["pending", "completed"] }
    });
    const highPriorityCount = allActive.filter(grievance => grievance.urgency_level === "High").length;
    const pendingVerifications = allActive.filter(grievance => grievance.status === "pending").length;
    res.json({
        allActive,
        assignedTasks: allActive.length,
        highPriorityCount,
        pendingVerifications
    });
};

export const getStaffStats = async (req, res) => {
    const staffId = req.params.staff_id;
    console.log(staffId);

    // count of grievances done by the staff
    const resolvedGrievances = await Grievance.find({ user_id: staffId });
    const resolvedCount = resolvedGrievances.length;

    // present status of staff
    const staff = await Staff.findOne({ user_id: staffId });
    const present = staff ? staff.is_active : null;

    console.log(resolvedCount);
    console.log(present);

    return res.json({
        resolvedCount,
        present,
    });
};

export const markComplete = async (req,res) =>{
    const grievanceId = req.body.grievance_id;
    try{
    const response = await Grievance.findOneAndUpdate({grievance_id:grievanceId},{status:"completed"});
    }
    catch(err){
        return res.json({
            message: "Error in marking the grievance as completed"
        });
    }
    return res.json({
        message: "Staff marked as completed"
    });
}

export const getStaffTasks = async (req, res) => {
    const staffId = req.params.staff_id;
    const grievances = await Grievance.find({
        staff_id: staffId,
        status: "pending"
    });
    res.json(grievances);
};