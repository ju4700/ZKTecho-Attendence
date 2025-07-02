import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  uniqueId: string;
  name: string;
  email?: string;
  phone?: string;
  monthlySalary: number;
  monthlyOffDays: number;
  isActive: boolean;
  biometricEnrolled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    sparse: true
  },
  phone: {
    type: String,
    trim: true
  },
  monthlySalary: {
    type: Number,
    required: true,
    min: 0
  },
  monthlyOffDays: {
    type: Number,
    required: true,
    min: 0,
    max: 30
  },
  isActive: {
    type: Boolean,
    default: true
  },
  biometricEnrolled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


// Only use unique: true in schema for uniqueId, do not add separate index to avoid duplicate index warning
UserSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);