import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import predictionsRoutes from './routes/predictions.js';
import historyRoutes from './routes/history.js';

// Import database pool untuk test koneksi
import pool from './db/config.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ==================== MIDDLEWARE ====================

// CORS - izinkan frontend mengakses API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON body
app.use(express.json());

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// ==================== ROUTES ====================

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Skywise Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      predictions: '/api/predictions',
      history: '/api/history',
    }
  });
});

// Health check dengan database
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/history', historyRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Endpoint tidak ditemukan',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
  🚀 Skywise Backend API running!
  
  📍 Server:    http://localhost:${PORT}
  📊 Health:    http://localhost:${PORT}/health
  🔐 Auth:      http://localhost:${PORT}/api/auth
  📈 Predict:   http://localhost:${PORT}/api/predictions
  📜 History:   http://localhost:${PORT}/api/history
  
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

export default app;
