import mongoose from 'mongoose';
import moment from 'moment-timezone';

const AttendanceRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    login: {
        type: Date
    },
    logout: {
        type: Date,
        default: null
    },
    duration: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    },  
    {
        timestamps: true
    })
export default mongoose.model("AttendanceRecord", AttendanceRecordSchema);