import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  findUserByGoogleId,
  createGoogleUser,
  updateGoogleUser,
  createLocalUser,
  createHistoryLog,
} from '../db/queries.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/signup - Daftar akun baru (local)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password harus diisi' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Email tidak valid' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = await createLocalUser({ email, name, passwordHash });

    // Log aktivitas
    await createHistoryLog(user.id, 'SIGNUP', { ip: req.ip });

    res.status(201).json({
      message: 'Pendaftaran berhasil! Silakan login dengan akun Anda.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Gagal mendaftar',
      error: error.message 
    });
  }
});

// POST /api/auth/login - Login dengan email & password (local)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    // Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Cek apakah user terdaftar dengan provider lain (Google)
    if (user.provider === 'google' && !user.password_hash) {
      return res.status(401).json({ 
        message: 'Akun ini terdaftar dengan Google. Silakan login dengan Google.' 
      });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email atau password salah' });
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
    await createHistoryLog(user.id, 'LOGIN', { ip: req.ip });

    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        provider: user.provider,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Gagal login',
      error: error.message 
    });
  }
});

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
