import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import User from './users.js';

const GrievanceSchema = new mongoose.Schema({
  grievance_id: {
    type: String,
    default: uuidv4,
    unique: true,
    primaryKey: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  category: {
    type: String,
    required: true,
    maxlength: 100
  },
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  submission_timestamp: {
    type: Date,
    default: Date.now
  },
  urgency_level: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  status: {
    type: String,
    required: true,
    maxlength: 50
  },
  voice_input_url: {
    type: String,
    maxlength: 255,
    default: null
  },
  language_detected: {
    type: String,
    default: 'English',
    maxlength: 20
  },
  items_used: {
    type: [String],
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

GrievanceSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Grievance = mongoose.model('Grievance', GrievanceSchema);

export default Grievance;