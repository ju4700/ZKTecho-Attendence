import mongoose from 'mongoose';

export interface ISalaryRecord {
  _id?: string;
  userId: string;
  uniqueId: string;
  month: number;
  year: number;
  baseSalary: number;
  totalWorkingDays: number;
  actualWorkingDays: number;
  totalWorkingHours: number;
  actualWorkingHours: number;
  hourlyRate: number;
  finalSalary: number;
  bonus?: number;
  deductions?: number;
  status: 'draft' | 'finalized' | 'paid';
  generatedAt: Date;
  finalizedAt?: Date;
  paidAt?: Date;
  notes?: string;
}

const SalaryRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uniqueId: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  totalWorkingDays: {
    type: Number,
    required: true,
    min: 0
  },
  actualWorkingDays: {
    type: Number,
    required: true,
    min: 0
  },
  totalWorkingHours: {
    type: Number,
    required: true,
    min: 0
  },
  actualWorkingHours: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  finalSalary: {
    type: Number,
    required: true,
    min: 0
  },
  bonus: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'finalized', 'paid'],
    default: 'draft'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  finalizedAt: {
    type: Date
  },
  paidAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


// Only use unique: true in schema for unique indexes, do not add separate index to avoid duplicate index warning
SalaryRecordSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
SalaryRecordSchema.index({ status: 1 });

export default mongoose.models.SalaryRecord || mongoose.model('SalaryRecord', SalaryRecordSchema);