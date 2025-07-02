const mongoose = require('mongoose');

// Always specify a database name for consistency (default to 'test' if not set)
let uri = process.env.MONGODB_URI || 'mongodb+srv://linkupcomctg:zktecho47@cluster0.zv60gyf.mongodb.net/test?retryWrites=true&w=majority';
if (!/\/[a-zA-Z0-9_-]+\?/.test(uri)) {
  // If no database name is present, add 'test' as default
  uri = uri.replace('.net/?', '.net/test?');
}
const MONGODB_URI = uri;

async function dropDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully');
  } catch (error) {
    console.error('Error dropping database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

dropDatabase();
