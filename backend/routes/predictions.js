import express from 'express';
import jwt from 'jsonwebtoken';
import {
  createPrediction,
  getPredictionsByUserId,
  getPredictionById,
  deletePrediction,
  createHistoryLog,
} from '../db/queries.js';

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

// POST /api/predictions - Simpan prediksi baru
router.post('/', authenticateToken, async (req, res) => {
  try {
    const predictionData = req.body;
    const prediction = await createPrediction(req.user.userId, predictionData);
    
    // Log aktivitas
    await createHistoryLog(req.user.userId, 'CREATE_PREDICTION', {
      predictionId: prediction.id,
      aqi: prediction.aqi,
    });

    res.status(201).json({
      message: 'Prediksi berhasil disimpan',
      prediction,
    });
  } catch (error) {
    console.error('Create prediction error:', error);
    res.status(500).json({ 
      message: 'Gagal menyimpan prediksi',
      error: error.message 
    });
  }
});

// GET /api/predictions - Ambil semua prediksi user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const predictions = await getPredictionsByUserId(req.user.userId, limit);
    
    res.json({
      predictions,
      count: predictions.length,
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data prediksi',
      error: error.message 
    });
  }
});

// GET /api/predictions/:id - Ambil satu prediksi
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const prediction = await getPredictionById(req.params.id);
    
    if (!prediction) {
      return res.status(404).json({ message: 'Prediksi tidak ditemukan' });
    }
    
    // Pastikan user hanya bisa akses prediksi miliknya
    if (prediction.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    res.json({ prediction });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data prediksi',
      error: error.message 
    });
  }
});

// DELETE /api/predictions/:id - Hapus prediksi
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await deletePrediction(req.params.id, req.user.userId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Prediksi tidak ditemukan' });
    }

    // Log aktivitas
    await createHistoryLog(req.user.userId, 'DELETE_PREDICTION', {
      predictionId: deleted.id,
    });

    res.json({
      message: 'Prediksi berhasil dihapus',
      prediction: deleted,
    });
  } catch (error) {
    console.error('Delete prediction error:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus prediksi',
      error: error.message 
    });
  }
});

export default router;
