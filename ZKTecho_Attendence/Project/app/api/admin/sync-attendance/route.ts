import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Attendance from '@/lib/models/Attendance';
import { zktecoService } from '@/lib/zkteco';
import { salaryCalculator } from '@/lib/salary-calculator';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Connect to ZKTeco device
    const connected = await zktecoService.connect();
    if (!connected) {
      return NextResponse.json(
        { error: 'Could not connect to ZKTeco device' },
        { status: 503 }
      );
    }

    // Fetch attendance logs from device
    const logs = await zktecoService.getAttendanceLogs();
    console.log(`Fetched ${logs.length} attendance logs from device`);

    let processedLogs = 0;
    let errors = 0;

    for (const log of logs) {
      try {
        // Find user by uniqueId
        const user = await User.findOne({ uniqueId: log.deviceUserId });
        if (!user) {
          console.warn(`User not found for device ID: ${log.deviceUserId}`);
          continue;
        }

        const logDate = new Date(log.timestamp);
        const dateOnly = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());

        // Find or create attendance record for this date
        let attendance = await Attendance.findOne({
          userId: user._id,
          date: dateOnly
        });

        if (!attendance) {
          attendance = new Attendance({
            userId: user._id,
            uniqueId: user.uniqueId,
            date: dateOnly,
            status: 'absent',
            workingHours: 0
          });
        }

        // Update check-in/check-out based on attendance type
        if (log.attendanceType === 0) { // Check-in
          if (!attendance.checkIn || logDate < attendance.checkIn) {
            attendance.checkIn = logDate;
          }
        } else if (log.attendanceType === 1) { // Check-out
          if (!attendance.checkOut || logDate > attendance.checkOut) {
            attendance.checkOut = logDate;
          }
        }

        // Calculate working hours and status
        if (attendance.checkIn && attendance.checkOut) {
          attendance.workingHours = salaryCalculator.calculateWorkingHours(
            attendance.checkIn,
            attendance.checkOut
          );
          
          if (attendance.workingHours >= 8) {
            attendance.status = 'present';
          } else if (attendance.workingHours > 0) {
            attendance.status = 'partial';
          }
        } else if (attendance.checkIn) {
          attendance.status = 'partial';
        }

        attendance.deviceId = log.deviceId;
        await attendance.save();
        processedLogs++;

      } catch (error) {
        console.error(`Error processing log for user ${log.deviceUserId}:`, error);
        errors++;
      }
    }

    // Clear processed logs from device (optional)
    try {
      await zktecoService.clearAttendanceLogs();
    } catch (error) {
      console.warn('Could not clear device logs:', error);
    }

    await zktecoService.disconnect();

    return NextResponse.json({
      message: 'Attendance sync completed',
      totalLogs: logs.length,
      processedLogs,
      errors,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync attendance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}