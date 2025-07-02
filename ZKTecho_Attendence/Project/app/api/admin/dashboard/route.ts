import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Attendance from '@/lib/models/Attendance';
import SalaryRecord from '@/lib/models/SalaryRecord';
import { zktecoService } from '@/lib/zkteco';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get today's attendance
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['present', 'partial'] }
    });

    // Get monthly salary total
    const monthlySalaryRecords = await SalaryRecord.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear,
          status: { $ne: 'draft' }
        }
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: '$finalSalary' }
        }
      }
    ]);

    const monthlySalary = monthlySalaryRecords.length > 0 ? monthlySalaryRecords[0].totalSalary : 0;

    // Check device status
    let deviceStatus = false;
    let lastSync = '';
    
    try {
      deviceStatus = await zktecoService.connect();
      if (deviceStatus) {
        await zktecoService.disconnect();
        lastSync = new Date().toISOString();
      }
    } catch (error) {
      console.error('Device check error:', error);
    }

    return NextResponse.json({
      totalUsers,
      activeUsers,
      todayAttendance,
      monthlySalary,
      deviceStatus,
      lastSync
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}