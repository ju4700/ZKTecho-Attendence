const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
// Always specify a database name for consistency (default to 'test' if not set)
let uri = process.env.MONGODB_URI || 'mongodb+srv://linkupcomctg:zktecho47@cluster0.zv60gyf.mongodb.net/test?retryWrites=true&w=majority';
// If the URI does not contain a database name, add 'test' as default
if (/\.net\/?(\?|$)/.test(uri)) {
  uri = uri.replace('.net/?', '.net/test?').replace('.net', '.net/test');
}
const MONGODB_URI = uri;

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'super_admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createDefaultAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');


    // Check if admin already exists (by username or email)
    const existingAdmin = await Admin.findOne({ $or: [ { username: 'admin' }, { email: 'admin@company.com' } ] });
    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    

    const admin = new Admin({
      username: 'admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    });

    await admin.save();
    console.log('Default admin created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the default password after first login');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createDefaultAdmin();