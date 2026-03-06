import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI is not defined in the environment variables. MongoDB connection will not be established.');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    }).catch(async (error) => {
      console.warn('⚠️ MongoDB connection error (cold start?). Retrying once in 2s...', error.message);
      await new Promise(res => setTimeout(res, 2000));
      return mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ Connected to MongoDB on retry');
        return mongoose;
      }).catch(err => {
        console.error('❌ MongoDB retry failed:', err);
        throw err;
      });
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
