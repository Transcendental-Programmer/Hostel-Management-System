import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const UserSchema = new Schema({
    user_id: { type: String, default: uuidv4, unique: true },
    username: { type: String, unique: true, required: true, maxlength: 50 },
    password_hash: { type: String, required: true, maxlength: 255 },
    email: { type: String, unique: true, required: true, maxlength: 100 },
    full_name: { type: String, required: true, maxlength: 100 },
    phone_number: { type: String, maxlength: 15, default: null },
    role_id: { type: String, required: true },
    department_id: { type: String, default: null },
    language_preference: { type: String, default: "English", maxlength: 20 },
    roll_number: { type: String, maxlength: 20, default: null },
    hostel_number: { type: String, maxlength: 20, default: null },
    room_number: { type: String, maxlength: 20, default: null },
    floor_number: { type: Number, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    available_time_slot: { type: String, maxlength: 50, default: null },
});

UserSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

export default mongoose.model('User', UserSchema);
