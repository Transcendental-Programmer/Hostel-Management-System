import AboutRoles from '../model/aboutRolesModel.js';

// Returns description of all roles
export const getRoles = async (req, res) => {
    try {
        const roles = await AboutRoles.find();
        res.json(roles);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
};