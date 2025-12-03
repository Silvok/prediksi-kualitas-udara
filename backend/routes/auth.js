import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserByGoogleId,
  createGoogleUser,
  updateGoogleUser,
  createHistoryLog,
} from '../db/queries.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google - Login dengan Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Credential diperlukan' });
    }

    // Verifikasi token dari Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Cek apakah user sudah ada
    let user = await findUserByGoogleId(googleId);

    if (!user) {
      // Cek apakah email sudah terdaftar dengan provider lain
      const existingUser = await findUserByEmail(email);
      
      if (existingUser) {
        // Update user yang sudah ada dengan info Google
        user = await updateGoogleUser({ email, name, googleId, picture });
      } else {
        // Buat user baru
        user = await createGoogleUser({ email, name, googleId, picture });
      }
    }

    // Buat JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log aktivitas
    await createHistoryLog(user.id, 'LOGIN_GOOGLE', { ip: req.ip });

    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture || picture,
        provider: user.provider,
      },
      token,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ 
      message: 'Verifikasi Google gagal',
      error: error.message 
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await findUserByEmail(decoded.email);
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        provider: user.provider,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(401).json({ message: 'Token tidak valid' });
  }
});

// POST /api/auth/logout - Logout (client-side only, just log it)
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await createHistoryLog(decoded.userId, 'LOGOUT', { ip: req.ip });
    }

    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    // Even if token is invalid, still return success
    res.json({ message: 'Logout berhasil' });
  }
});

export default router;
