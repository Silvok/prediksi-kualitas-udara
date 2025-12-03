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

// URL Python ML API
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

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

// Middleware opsional - jika tidak ada token, tetap lanjut
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token tidak valid, tapi tetap lanjut
    }
  }
  next();
};

// POST /api/predictions/validate - Validasi prediksi menggunakan ML Model (tanpa login)
router.post('/validate', optionalAuth, async (req, res) => {
  try {
    const { suhu, kelembapan, tekanan, kecepatan_angin } = req.body;
    
    // Validasi input
    if (suhu === undefined || kelembapan === undefined || 
        tekanan === undefined || kecepatan_angin === undefined) {
      return res.status(400).json({
        message: 'Semua parameter harus diisi (suhu, kelembapan, tekanan, kecepatan_angin)'
      });
    }
    
    // Panggil Python ML API
    const mlResponse = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suhu: parseFloat(suhu),
        kelembapan: parseFloat(kelembapan),
        tekanan: parseFloat(tekanan),
        kecepatan_angin: parseFloat(kecepatan_angin)
      })
    });
    
    if (!mlResponse.ok) {
      const errorData = await mlResponse.json();
      // Teruskan validation errors dari ML API
      return res.status(mlResponse.status).json({
        message: errorData.error || 'Gagal mendapatkan prediksi dari ML API',
        error: errorData.error,
        validation_errors: errorData.validation_errors,
        valid_ranges: errorData.valid_ranges
      });
    }
    
    const mlResult = await mlResponse.json();
    
    res.json({
      success: true,
      prediction: mlResult.prediction,
      input: mlResult.input,
      feedback: mlResult.feedback
    });
    
  } catch (error) {
    console.error('Validate prediction error:', error);
    
    // Jika ML API tidak tersedia, gunakan fallback sederhana
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: 'ML API tidak tersedia. Pastikan Python API berjalan di port 5000.',
        error: 'CONNECTION_REFUSED'
      });
    }
    
    res.status(500).json({ 
      message: 'Gagal memvalidasi prediksi',
      error: error.message 
    });
  }
});

// GET /api/predictions/stats - Ambil statistik dataset
router.get('/stats', async (req, res) => {
  try {
    const mlResponse = await fetch(`${ML_API_URL}/stats`);
    
    if (!mlResponse.ok) {
      return res.status(mlResponse.status).json({
        message: 'Gagal mengambil statistik dari ML API'
      });
    }
    
    const stats = await mlResponse.json();
    res.json(stats);
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil statistik',
      error: error.message 
    });
  }
});

// POST /api/predictions - Simpan prediksi baru (memerlukan login)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { suhu, kelembapan, tekanan, kecepatan_angin, kualitas, score, confidence } = req.body;
    
    // Validasi input
    if (suhu === undefined || kelembapan === undefined || 
        tekanan === undefined || kecepatan_angin === undefined || !kualitas) {
      return res.status(400).json({
        message: 'Data tidak lengkap. Pastikan semua parameter diisi.'
      });
    }
    
    const predictionData = {
      suhu: parseFloat(suhu),
      kelembapan: parseFloat(kelembapan),
      tekanan: parseFloat(tekanan),
      kecepatan_angin: parseFloat(kecepatan_angin),
      kualitas,
      score: parseInt(score) || 0,
      confidence: parseFloat(confidence) || 0
    };
    
    const prediction = await createPrediction(req.user.userId, predictionData);
    
    // Log aktivitas
    await createHistoryLog(req.user.userId, 'CREATE_PREDICTION', {
      predictionId: prediction.id,
      kualitas: prediction.kualitas,
      score: prediction.score
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
