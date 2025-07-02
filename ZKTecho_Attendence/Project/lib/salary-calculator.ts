import { IUser } from './models/User';
import { IAttendance } from './models/Attendance';

export interface SalaryCalculation {
  baseSalary: number;
  totalWorkingDays: number;
  actualWorkingDays: number;
  totalWorkingHours: number;
  actualWorkingHours: number;
  hourlyRate: number;
  finalSalary: number;
  attendanceRate: number;
}

export class SalaryCalculator {
  private standardWorkingHours = 8; // 8 hours per day

  calculateMonthlySalary(
    user: IUser,
    attendanceRecords: IAttendance[],
    month: number,
    year: number
  ): SalaryCalculation {
    const daysInMonth = new Date(year, month, 0).getDate();
    const totalWorkingDays = daysInMonth - user.monthlyOffDays;
    const totalWorkingHours = totalWorkingDays * this.standardWorkingHours;
    const hourlyRate = user.monthlySalary / totalWorkingHours;

    // Calculate actual working hours and days
    let actualWorkingHours = 0;
    let actualWorkingDays = 0;

    attendanceRecords.forEach(record => {
      if (record.status === 'present' || record.status === 'partial') {
        actualWorkingHours += record.workingHours;
        if (record.workingHours > 0) {
          actualWorkingDays++;
        }
      }
    });

    const finalSalary = Math.round(actualWorkingHours * hourlyRate);
    const attendanceRate = totalWorkingDays > 0 ? (actualWorkingDays / totalWorkingDays) * 100 : 0;

    return {
      baseSalary: user.monthlySalary,
      totalWorkingDays,
      actualWorkingDays,
      totalWorkingHours,
      actualWorkingHours: Math.round(actualWorkingHours * 100) / 100,
      hourlyRate: Math.round(hourlyRate * 100) / 100,
      finalSalary,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  }

  calculateWorkingHours(checkIn: Date, checkOut: Date): number {
    if (!checkIn || !checkOut) return 0;
    
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Cap at 24 hours and ensure positive
    return Math.max(0, Math.min(24, diffHours));
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  getWorkingDaysInMonth(month: number, year: number, offDays: number): number {
    const totalDays = this.getDaysInMonth(month, year);
    return Math.max(0, totalDays - offDays);
  }

  calculateOvertimeHours(workingHours: number, standardHours: number = 8): number {
    return Math.max(0, workingHours - standardHours);
  }

  calculateOvertimePay(overtimeHours: number, hourlyRate: number, overtimeMultiplier: number = 1.5): number {
    return overtimeHours * hourlyRate * overtimeMultiplier;
  }
}

export const salaryCalculator = new SalaryCalculator();