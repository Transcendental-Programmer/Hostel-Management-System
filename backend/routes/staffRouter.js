import express from 'express';
import {
    getStaffHistory,
    getActiveGrievances,
    getStaffStats,
    markComplete,
    getStaffTasks
} from '../controller/staffController.js';

const staffRoutes = express.Router();

staffRoutes.get("/getActiveGrievances/:staff_id", getActiveGrievances);
staffRoutes.get("/getStaffHistory/:staff_id", getStaffHistory);
staffRoutes.get("/getStaffStats/:staff_id", getStaffStats);
staffRoutes.get("/getStaffTasks/:staff_id",getStaffTasks);
staffRoutes.put("/markComplete", markComplete);

staffRoutes.all("*", (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default staffRoutes;