import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import issueRoutes from './routes/issues.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import statisticsRoutes from './routes/statistics.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
