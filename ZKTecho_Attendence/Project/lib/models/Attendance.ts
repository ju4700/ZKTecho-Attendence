import mongoose from 'mongoose';

export interface IAttendance {
  _id?: string;
  userId: string;
  uniqueId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  workingHours: number;
  status: 'present' | 'absent' | 'partial' | 'off';
  notes?: string;
  deviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uniqueId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  workingHours: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'partial', 'off'],
    default: 'absent'
  },
  notes: {
    type: String,
    trim: true
  },
  deviceId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


// Only use unique: true in schema for unique indexes, do not add separate index to avoid duplicate index warning
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);