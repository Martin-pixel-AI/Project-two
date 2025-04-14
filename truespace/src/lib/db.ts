import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truespace';

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function connectDB() {
  if (connection.isConnected) {
    console.log('Using existing connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export default connectDB; 