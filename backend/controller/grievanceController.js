import Grievance from '../models/grievances.js'; 

// Create a new grievance
export const createGrievance = async (req, res) => {
    try {
        const { user_id, title, description, category, urgency_level, items_used } = req.body;
        const grievance = await Grievance.create({
            user_id,
            title,
            description,
            category,
            urgency_level,
            status: "Pending",
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
        res.json(grievances);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error: Failed to get grievances");
    }
};

// Get all grievances submitted by a user
export const getGrievancesByUser = async (req, res) => {
    try {
        const { user_id } = req.body;
        const grievances = await Grievance.find({ user_id });
        res.json(grievances);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error: Failed to get grievances");
    }
};
// Get a grievance by ID
export const getGrievanceById = async (req, res) => {
    try {
        const { grievance_id } = req.body;
        const grievance = await Grievance.findOne({ grievance_id });
        res.json(grievance);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json("Server error: Failed to get grievance");
    }
};

// Update a grievance by ID
export const updateGrievanceById = async (req, res) => {
    try {
        const { grievance_id, status, title, description,urgency_level, items_used } = req.body;
        const grievance = await Grievance.findOneAndUpdate({ grievance_id }, { status }, { title },{urgency_level},{items_used}, { description }, { new: true });
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

// Detect language of a grievance
