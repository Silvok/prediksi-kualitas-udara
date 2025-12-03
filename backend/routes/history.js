import express from 'express';
import jwt from 'jsonwebtoken';
import { getHistoryByUserId } from '../db/queries.js';

const router = express.Router();

// Middleware untuk verifikasi JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// GET /api/history - Ambil history aktivitas user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const history = await getHistoryByUserId(req.user.userId, limit);
    
    res.json({
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data history',
      error: error.message 
    });
  }
});

export default router;
