'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  AlertCircle,
  Calendar,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  todayAttendance: number;
  monthlySalary: number;
  deviceStatus: boolean;
  lastSync: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    todayAttendance: 0,
    monthlySalary: 0,
    deviceStatus: false,
    lastSync: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncAttendance = async () => {
    try {
      const response = await fetch('/api/admin/sync-attendance', {
        method: 'POST',
      });
      if (response.ok) {
        await fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error syncing attendance:', error);
    }
  };

  const attendanceRate = stats.totalUsers > 0 ? (stats.todayAttendance / stats.totalUsers) * 100 : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your attendance system.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant={stats.deviceStatus ? "default" : "destructive"} className="flex items-center">
            {stats.deviceStatus ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Device Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Device Offline
              </>
            )}
          </Badge>
          <Button onClick={syncAttendance} size="sm">
            Sync Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAttendance}</div>
            <div className="mt-2">
              <Progress value={attendanceRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {attendanceRate.toFixed(1)}% attendance rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.monthlySalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total payroll this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {stats.lastSync ? new Date(stats.lastSync).toLocaleString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              Device synchronization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Register New User
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              View Today's Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Generate Salary Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current system health and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <Badge variant="default">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">ZKTeco Device</span>
              <Badge variant={stats.deviceStatus ? "default" : "destructive"}>
                {stats.deviceStatus ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Backup</span>
              <Badge variant="secondary">2 hours ago</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest attendance and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium">John Doe checked in</p>
                <p className="text-xs text-muted-foreground">8:15 AM - On time</p>
              </div>
              <Badge variant="default">Check-in</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium">Jane Smith checked out</p>
                <p className="text-xs text-muted-foreground">6:30 PM - 8.5 hours</p>
              </div>
              <Badge variant="secondary">Check-out</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">Mike Johnson - ID: EMP001</p>
              </div>
              <Badge variant="outline">Registration</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}