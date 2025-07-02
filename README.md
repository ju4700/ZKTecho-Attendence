# ZKTeco K40 Attendance Management System

A comprehensive attendance management system built with Next.js, MongoDB Atlas, and ZKTeco K40 biometric device integration.

## Features

- **User Management**: Register users with salary information and biometric enrollment
- **Real-time Attendance Tracking**: Sync attendance data from ZKTeco K40 device
- **Automated Salary Calculation**: Calculate salaries based on working hours and monthly rates
- **Admin Dashboard**: View attendance logs, salary reports, and system status
- **Device Integration**: Connect and sync with ZKTeco K40 biometric attendance machine
- **Export Reports**: Generate CSV/PDF reports for attendance and salary data
- **Secure Authentication**: JWT-based admin authentication system

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, shadcn/ui
- **Device Integration**: zklib for ZKTeco communication
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **CSV Export**: csv-writer

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account and cluster
- ZKTeco K40 device on the same network
- Device IP address (default: 192.168.1.201)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-system?retryWrites=true&w=majority
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # ZKTeco Device Configuration
   ZKTECO_IP=192.168.1.201
   ZKTECO_PORT=4370
   ZKTECO_INPORT=5200
   ZKTECO_TIMEOUT=5000
   ```

4. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get the connection string and update `MONGODB_URI`
   - Whitelist your IP address

5. **Create Default Admin**
   ```bash
   node scripts/setup-admin.js
   ```
   Default credentials:
   - Username: `admin`
   - Password: `admin123`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open http://localhost:3000
   - Login with default admin credentials
   - Change the default password immediately

## ZKTeco K40 Setup

1. **Network Configuration**
   - Connect K40 to the same network as your server
   - Set a static IP address (e.g., 192.168.1.201)
   - Ensure the device is accessible from your server

2. **Device Settings**
   - Enable network communication
   - Set the correct time zone
   - Configure attendance modes (check-in/check-out)

3. **Test Connection**
   - Use the admin dashboard to test device connectivity
   - Sync attendance logs to verify communication

## Usage

### User Registration

1. Navigate to **Admin > User Registration**
2. Fill in user details:
   - Unique ID (will be used on the biometric device)
   - Full name
   - Email and phone (optional)
   - Monthly salary in Taka
   - Monthly off days
3. Enable biometric enrollment to register user on the device
4. Click "Register User"

### Attendance Tracking

1. Users punch in/out on the ZKTeco K40 device
2. Use **Admin > Dashboard** to sync attendance data
3. View attendance logs in **Admin > Attendance**
4. System automatically calculates working hours

### Salary Calculation

The system automatically calculates salaries based on:
- Monthly salary amount
- Working days (total days - off days)
- Actual hours worked
- Hourly rate = Monthly salary ÷ (Working days × 8 hours)

### Reports

1. **Attendance Reports**: View daily/monthly attendance logs
2. **Salary Reports**: Generate monthly salary calculations
3. **Export Options**: Download reports as CSV or PDF

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/sync-attendance` - Sync attendance from device

### User Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Attendance
- `GET /api/admin/attendance` - Get attendance records
- `POST /api/admin/attendance` - Manual attendance entry

### Salary
- `GET /api/admin/salary` - Get salary records
- `POST /api/admin/salary/generate` - Generate monthly salary

## Database Schema

### Users Collection
```javascript
{
  uniqueId: String (unique),
  name: String,
  email: String,
  phone: String,
  monthlySalary: Number,
  monthlyOffDays: Number,
  isActive: Boolean,
  biometricEnrolled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId,
  uniqueId: String,
  date: Date,
  checkIn: Date,
  checkOut: Date,
  workingHours: Number,
  status: String, // 'present', 'absent', 'partial', 'off'
  notes: String,
  deviceId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Salary Records Collection
```javascript
{
  userId: ObjectId,
  uniqueId: String,
  month: Number,
  year: Number,
  baseSalary: Number,
  totalWorkingDays: Number,
  actualWorkingDays: Number,
  totalWorkingHours: Number,
  actualWorkingHours: Number,
  hourlyRate: Number,
  finalSalary: Number,
  status: String, // 'draft', 'finalized', 'paid'
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Device Connection Issues
1. Check network connectivity
2. Verify IP address and port settings
3. Ensure firewall allows communication
4. Test with ZKTeco's official software first

### Database Connection Issues
1. Verify MongoDB Atlas connection string
2. Check IP whitelist settings
3. Ensure network access is enabled

### Sync Problems
1. Check device time synchronization
2. Verify user enrollment on device
3. Clear device logs if memory is full

## Security Considerations

- Change default admin credentials immediately
- Use strong JWT secrets in production
- Implement rate limiting for API endpoints
- Secure biometric data according to local regulations
- Use HTTPS in production
- Regular backup of attendance and salary data

## Deployment

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy application

### Production Considerations
- Use production MongoDB Atlas cluster
- Implement proper error logging
- Set up monitoring and alerts
- Configure automated backups
- Use environment-specific configurations

## Support

For technical support or questions:
1. Check the troubleshooting section
2. Review ZKTeco K40 documentation
3. Contact ZKTeco support for device-specific issues
4. Check MongoDB Atlas documentation for database issues

## License

This project is licensed under the MIT License.