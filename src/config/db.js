import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bio-rendering';

  try {
    console.log(`🔌 Đang kết nối MongoDB: ${uri.replace(/\/\/.*@/, '//***:***@')}...`);
    
    // Mongoose connect with 5 second timeout so it doesn't hang if MongoDB is unavailable
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });

    isConnected = true;
    console.log('✅ Kết nối MongoDB thành công!');
  } catch (error) {
    isConnected = false;
    console.warn('⚠️  Chưa thể kết nối tới MongoDB:', error.message);
    console.warn('💡 Hệ thống sẽ tự động sử dụng bộ nhớ cục bộ (JSON fallback) để tiếp tục hoạt động.');
    console.warn('👉 Bạn có thể cấu hình MONGODB_URI trong file .env (ví dụ MongoDB Atlas hoặc kiểm tra MongoDB service).');
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️  Mất kết nối MongoDB. Đang chuyển sang chế độ dự phòng...');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('✅ Đã kết nối lại MongoDB thành công!');
  });
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
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
