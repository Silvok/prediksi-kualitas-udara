# Skywise Backend API

Backend API untuk aplikasi prediksi kualitas udara dengan PostgreSQL dan Google OAuth.

## Teknologi

- **Node.js** + **Express** - Server API
- **PostgreSQL** - Database
- **google-auth-library** - Verifikasi Google OAuth token
- **jsonwebtoken** - JWT authentication

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Konfigurasi Database PostgreSQL

1. Buka **pgAdmin** atau psql
2. Buat database baru dengan nama `skywise_db`:
   ```sql
   CREATE DATABASE skywise_db;
   ```

### 3. Konfigurasi Environment

Edit file `.env` dan sesuaikan:

```env
# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/skywise_db
DB_USER=postgres
DB_PASSWORD=password_anda

# Google OAuth (dari Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id

# JWT Secret (ganti dengan string random yang panjang)
JWT_SECRET=your_super_secret_key
```

### 4. Inisialisasi Database

```bash
npm run db:init
```

Ini akan membuat tabel `users`, `predictions`, dan `history`.

### 5. Jalankan Server

```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:4000`

## API Endpoints

### Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/google` | Login dengan Google OAuth |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/logout` | Logout |

### Predictions

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/predictions` | Ambil semua prediksi user |
| POST | `/api/predictions` | Simpan prediksi baru |
| GET | `/api/predictions/:id` | Ambil satu prediksi |
| DELETE | `/api/predictions/:id` | Hapus prediksi |

### History

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/history` | Ambil history aktivitas user |

## Struktur Folder

```
backend/
├── db/
│   ├── config.js     # Konfigurasi koneksi PostgreSQL
│   ├── init.js       # Script inisialisasi tabel
│   └── queries.js    # Query functions
├── routes/
│   ├── auth.js       # Routes authentication
│   ├── predictions.js # Routes predictions
│   └── history.js    # Routes history
├── .env              # Environment variables (jangan commit!)
├── .env.example      # Template environment
├── .gitignore
├── index.js          # Entry point server
├── package.json
└── README.md
```
