import mongoose from 'mongoose';

// Cache connection across serverless function invocations
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bio-rendering';

  if (!cached.promise) {
    console.log(`🔌 Đang kết nối MongoDB: ${uri.replace(/\/\/.*@/, '//***:***@')}...`);
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        console.log('✅ Kết nối MongoDB thành công!');
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.warn('⚠️  Chưa thể kết nối tới MongoDB:', error.message);
        console.warn('💡 Hệ thống sẽ tự động sử dụng bộ nhớ cục bộ (JSON fallback) để tiếp tục hoạt động.');
        console.warn('👉 Bạn có thể cấu hình MONGODB_URI trong file .env (ví dụ MongoDB Atlas hoặc kiểm tra MongoDB service).');
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
  }

  return cached.conn;
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export function getMongoStatus() {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  return {
    connected: isMongoConnected(),
    state: states[stateIndex] || 'Unknown',
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
}
