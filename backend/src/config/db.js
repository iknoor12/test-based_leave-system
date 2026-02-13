import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI is not defined in the environment');
    throw new Error('MONGO_URI is not defined in the environment');
  }

  console.log('Attempting to connect to MongoDB...');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;
