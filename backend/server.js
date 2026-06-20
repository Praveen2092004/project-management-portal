import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Link your official routes 
app.use('/api/tasks', taskRoutes);

// Connect to Local MongoDB Server (using localhost to resolve local IP cleanly)
const dbURI = 'mongodb://localhost:27017/project_portal';
mongoose.connect(dbURI)
  .then(() => console.log('Successfully connected to Local MongoDB Server!'))
  .catch((err) => console.error('Database connection error:', err));

// Start the Server on Port 5000
app.listen(PORT, () => {
  console.log(`Backend server is running locally on http://localhost:${PORT}`);
});