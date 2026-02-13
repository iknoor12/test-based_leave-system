import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

console.log('Starting server...');
console.log('Environment check:');
console.log('- PORT:', process.env.PORT || 5000);
console.log('- MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('- ADMIN_PASSKEY:', process.env.ADMIN_PASSKEY ? '✓ Set' : '✗ Missing');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('⚠ MongoDB connection failed - server will not start');
    console.error('Error:', error.message);
    console.error('\nTo fix this issue:');
    console.error('1. Check your MongoDB Atlas IP whitelist settings');
    console.error('2. Add your current IP address to the whitelist');
    console.error('3. Or allow access from anywhere (0.0.0.0/0) for development');
    console.error('\nThe frontend will use local storage authentication instead.');
    process.exit(1);
  }
};

startServer();
