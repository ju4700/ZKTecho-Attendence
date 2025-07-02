
import mongoose from 'mongoose';

// Fix: Extend global type to allow caching mongoose connection
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: any; promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}


let cached = global.mongoose;
if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

async function connectDB() {
  if (!cached) throw new Error('Mongoose cache not initialized');
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;