import pool from './config.js';

// ==================== USER QUERIES ====================

// Cari user berdasarkan email
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

// Cari user berdasarkan Google ID
export const findUserByGoogleId = async (googleId) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE google_id = $1',
    [googleId]
  );
  return result.rows[0];
};

// Buat user baru (Google OAuth)
export const createGoogleUser = async ({ email, name, googleId, picture }) => {
  const result = await pool.query(
    `INSERT INTO users (email, name, google_id, picture, provider)
     VALUES ($1, $2, $3, $4, 'google')
     RETURNING id, email, name, picture, provider, created_at`,
    [email, name, googleId, picture]
  );
  return result.rows[0];
};

// Update user dari Google OAuth (jika sudah ada)
export const updateGoogleUser = async ({ email, name, googleId, picture }) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $2, google_id = $3, picture = $4, updated_at = CURRENT_TIMESTAMP
     WHERE email = $1
     RETURNING id, email, name, picture, provider, created_at`,
    [email, name, googleId, picture]
  );
  return result.rows[0];
};

// Buat user baru (local)
export const createLocalUser = async ({ email, name, passwordHash }) => {
  const result = await pool.query(
    `INSERT INTO users (email, name, password_hash, provider)
     VALUES ($1, $2, $3, 'local')
     RETURNING id, email, name, provider, created_at`,
    [email, name, passwordHash]
  );
  return result.rows[0];
};

// ==================== PREDICTION QUERIES ====================

// Simpan prediksi baru (data cuaca)
export const createPrediction = async (userId, predictionData) => {
  const { suhu, kelembapan, tekanan, kecepatan_angin, kualitas, score, confidence } = predictionData;
  const result = await pool.query(
    `INSERT INTO predictions (user_id, suhu, kelembapan, tekanan, kecepatan_angin, kualitas, score, confidence)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, suhu, kelembapan, tekanan, kecepatan_angin, kualitas, score, confidence]
  );
  return result.rows[0];
};

// Ambil semua prediksi user
export const getPredictionsByUserId = async (userId, limit = 50) => {
  const result = await pool.query(
    `SELECT * FROM predictions 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

// Ambil prediksi berdasarkan ID
export const getPredictionById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM predictions WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Hapus prediksi
export const deletePrediction = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM predictions WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0];
};

// ==================== HISTORY QUERIES ====================

// Simpan log aktivitas
export const createHistoryLog = async (userId, action, details = {}) => {
  const result = await pool.query(
    `INSERT INTO history (user_id, action, details)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, action, JSON.stringify(details)]
  );
  return result.rows[0];
};

// Ambil history user
export const getHistoryByUserId = async (userId, limit = 100) => {
  const result = await pool.query(
    `SELECT * FROM history 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

export default {
  findUserByEmail,
  findUserByGoogleId,
  createGoogleUser,
  updateGoogleUser,
  createLocalUser,
  createPrediction,
  getPredictionsByUserId,
  getPredictionById,
  deletePrediction,
  createHistoryLog,
  getHistoryByUserId,
};
