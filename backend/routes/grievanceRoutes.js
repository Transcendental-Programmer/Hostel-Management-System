import express from 'express';
import {
  createGrievance,
  getAllGrievances,
  getOpenGrievances,
  getGrievancesByUser,
  getGrievanceById,
  updateGrievanceById,
  deleteGrievanceById,
  getStaff,
  assignStaff,
  getQuickStats,
  getStaffOverview,
  getRecentActivity,
  getPerformanceData
} from '../controller/grievanceController.js';

const grievanceRoutes = express.Router();

grievanceRoutes.post("/new", createGrievance);
grievanceRoutes.get("/open", getOpenGrievances);
// Admin dashboard APIs
grievanceRoutes.get("/staff", getStaff);
grievanceRoutes.get("/quick-stats", getQuickStats);
grievanceRoutes.get("/staff-overview", getStaffOverview);
grievanceRoutes.get("/recent-activity", getRecentActivity);
grievanceRoutes.get("/performance-data", getPerformanceData);

grievanceRoutes.get("/:user_id", getGrievancesByUser);
grievanceRoutes.get("/details/:grievance_id", getGrievanceById);
grievanceRoutes.put("/update/:grievance_id", updateGrievanceById);
grievanceRoutes.delete("/delete/:grievance_id", deleteGrievanceById);
grievanceRoutes.put("/assign", assignStaff);


// Catch-all route for undefined routes under /grievances
grievanceRoutes.all("*", (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default grievanceRoutes;
