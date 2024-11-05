import express from 'express';
import { createGrievance,
    getAllGrievances,
    getOpenGrievances,
    getGrievancesByUser,
    getGrievanceById,
    updateGrievanceById,
    deleteGrievanceById,
 } from '../controller/grievanceController.js';

const grievanceRoutes = express.Router();

grievanceRoutes.post("/new", createGrievance);
grievanceRoutes.get("/", getAllGrievances);
grievanceRoutes.get("/open", getOpenGrievances);
grievanceRoutes.get("/:user_id", getGrievancesByUser);
grievanceRoutes.get("/details/:grievance_id", getGrievanceById);
grievanceRoutes.put("/update/:grievance_id", updateGrievanceById);
grievanceRoutes.delete("/delete/:grievance_id", deleteGrievanceById);
export default grievanceRoutes;
