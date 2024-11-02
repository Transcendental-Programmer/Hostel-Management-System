import express from 'express';
import { createGrievance,
    getAllGrievances,
    getGrievancesByUser,
    getGrievanceById,
    updateGrievanceById,
    deleteGrievanceById,
 } from '../controller/grievanceController.js';

const grievanceRoutes = express.Router();

grievanceRoutes.post("/new", createGrievance);
grievanceRoutes.get("/grievance", getAllGrievances);
grievanceRoutes.get("/grievance/:user_id", getGrievancesByUser);
grievanceRoutes.get("/grievance/:grievance_id", getGrievanceById);
grievanceRoutes.put("/grievance/:grievance_id", updateGrievanceById);
grievanceRoutes.delete("/grievance/:grievance_id", deleteGrievanceById);
export default grievanceRoutes;
