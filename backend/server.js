import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hubspotRoutes from './routes/hubspotRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.REACT_APP_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/hubspot', hubspotRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});