import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Description of all roles : Just stored in the database for only display on frontend

const AboutRolesSchema = new mongoose.Schema({
    role_id: { type: String, default: uuidv4, unique: true },
    role_name: { type: String, required: true, unique: true, maxlength: 50 },
    role_description: { type: String, maxlength: 255 },
});
export default mongoose.model('AboutRoles', AboutRolesSchema);