import ZKLib from 'zklib-js';

export interface ZKTecoDevice {
  ip: string;
  port: number;
  inport: number;
  timeout: number;
}

export interface AttendanceLog {
  deviceUserId: string;
  timestamp: Date;
  attendanceType: number; // 0=check-in, 1=check-out, 2=break-out, 3=break-in, 4=overtime-in, 5=overtime-out
  deviceId: string;
}

class ZKTecoService {
  private device: any;
  private config: ZKTecoDevice;

  constructor(config: ZKTecoDevice) {
    this.config = config;
    this.device = new ZKLib({
      ip: config.ip,
      port: config.port,
      inport: config.inport,
      timeout: config.timeout
    });
  }

  async connect(): Promise<boolean> {
    try {
      await this.device.createSocket();
      return true;
    } catch (error) {
      console.error('ZKTeco connection error:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.device.disconnect();
    } catch (error) {
      console.error('ZKTeco disconnection error:', error);
    }
  }

  async getAttendanceLogs(): Promise<AttendanceLog[]> {
    try {
      const logs = await this.device.getAttendances();
      return logs.map((log: any) => ({
        deviceUserId: log.deviceUserId.toString(),
        timestamp: new Date(log.timestamp),
        attendanceType: log.attendanceType,
        deviceId: this.config.ip
      }));
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
      return [];
    }
  }

  async clearAttendanceLogs(): Promise<boolean> {
    try {
      await this.device.clearAttendanceLog();
      return true;
    } catch (error) {
      console.error('Error clearing attendance logs:', error);
      return false;
    }
  }

  async enrollUser(userId: string, name: string): Promise<boolean> {
    try {
      await this.device.setUser(userId, name, 0, '', 0, 0);
      return true;
    } catch (error) {
      console.error('Error enrolling user:', error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.device.deleteUser(userId);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const users = await this.device.getUsers();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async getDeviceInfo(): Promise<any> {
    try {
      const info = await this.device.getInfo();
      return info;
    } catch (error) {
      console.error('Error fetching device info:', error);
      return null;
    }
  }
}

// Default device configuration
const defaultConfig: ZKTecoDevice = {
  ip: process.env.ZKTECO_IP || '192.168.1.201',
  port: parseInt(process.env.ZKTECO_PORT || '4370'),
  inport: parseInt(process.env.ZKTECO_INPORT || '5200'),
  timeout: parseInt(process.env.ZKTECO_TIMEOUT || '5000')
};

export const zktecoService = new ZKTecoService(defaultConfig);
export default ZKTecoService;