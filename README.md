# 🌤️ Skywise - Sistem Prediksi Kualitas Udara

Aplikasi web untuk memprediksi dan memvalidasi kualitas udara berdasarkan parameter cuaca seperti suhu, kelembapan, tekanan udara, dan kecepatan angin. Dibangun dengan React + Vite (Frontend) dan Node.js + Express + PostgreSQL (Backend).

![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-web-blue.svg)

---

## 📋 Daftar Isi

- [Fitur Unggulan](#-fitur-unggulan)
- [Teknologi](#-teknologi)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Screenshot](#-screenshot)
- [Kontributor](#-kontributor)

---

## ✨ Fitur Unggulan

### 🎯 Prediksi Kualitas Udara Real-Time
- Validasi kualitas udara berdasarkan 4 parameter utama:
  - **Suhu (°C)** - Range optimal: 15-35°C
  - **Kelembapan (%)** - Range optimal: 30-80%
  - **Tekanan Udara (mb)** - Range optimal: 1000-1030 mb
  - **Kecepatan Angin (m/s)** - Range optimal: 0-20 m/s
- Hasil prediksi dengan **skor persentase** (0-100%)
- Klasifikasi kualitas: **Baik** ✅, **Sedang** ⚠️, atau **Kurang** ❌

### 📊 Dashboard Riwayat Lengkap
- Lihat semua riwayat validasi sebelumnya
- **Filter** berdasarkan kualitas (Baik/Sedang/Kurang)
- **Pencarian** berdasarkan tanggal, skor, atau suhu
- **Statistik ringkas**: rata-rata skor, skor tertinggi, total prediksi

### 🔐 Autentikasi Aman
- Login dengan **Google OAuth 2.0**
- Autentikasi berbasis **JWT Token**
- Penyimpanan data user di PostgreSQL

### 🎨 UI/UX Modern
- Desain responsif untuk semua ukuran layar
- Animasi smooth dengan Tailwind CSS
- Glassmorphism design
- Dark/Light gradient background

### 💾 Penyimpanan Data Terstruktur
- Database PostgreSQL untuk persistensi data
- Tabel terpisah untuk users, predictions, dan history
- Query yang dioptimasi untuk performa

---

## 🛠️ Teknologi

### Frontend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| React | 18.2.0 | Library UI |
| Vite | 5.0.9 | Build tool |
| Tailwind CSS | 3.4.7 | Styling |
| React Router | 7.10.0 | Routing |
| @react-oauth/google | 0.12.2 | Google OAuth |

### Backend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Node.js | 18+ | Runtime |
| Express | 4.18.2 | Web framework |
| PostgreSQL | 15+ | Database |
| JWT | 9.0.2 | Authentication |
| google-auth-library | 9.4.1 | Google verification |

---

## 📦 Prasyarat

Pastikan Anda sudah menginstall:

- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** atau **yarn** (sudah termasuk dengan Node.js)
- **PostgreSQL** (v15 atau lebih baru) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Google Cloud Console** account untuk OAuth credentials

---

## 🚀 Instalasi & Setup

### Langkah 1: Clone Repository

```bash
git clone https://github.com/Silvok/prediksi-kualitas-udara.git
cd prediksi-kualitas-udara
```

### Langkah 2: Setup Database PostgreSQL

1. Buka **pgAdmin** atau **psql** terminal
2. Buat database baru:
   ```sql
   CREATE DATABASE skywise_db;
   ```

### Langkah 3: Setup Backend

```bash
# Masuk ke folder backend (dari root project)
cd backend

# Install dependencies
npm install

# Buat file .env (copy dari template jika ada)
# Atau buat manual dengan isi berikut:
```

Buat file `.env` di folder `backend/` dengan isi:

```env
# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/skywise_db

# Google OAuth (dapatkan dari Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here

# JWT Secret (ganti dengan string random yang panjang)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=4000
```

> ⚠️ **Penting**: Ganti `PASSWORD_ANDA` dengan password PostgreSQL Anda!

```bash
# Inisialisasi tabel database
npm run db:init

# Jalankan server backend (development)
npm run dev

# Atau untuk production
npm start
```

Backend akan berjalan di `http://localhost:4000`

### Langkah 4: Setup Frontend

Buka terminal baru:

```bash
# Dari root project, masuk ke folder frontend
cd FE-aja

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Langkah 5: Setup Google OAuth (Opsional tapi Direkomendasikan)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan **Google+ API** dan **Google Identity Services**
4. Buat **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
5. Copy **Client ID** dan paste ke:
   - File `.env` di backend (`GOOGLE_CLIENT_ID`)
   - File `.env` di frontend (jika ada) atau langsung di kode

### Langkah 6: Akses Aplikasi

1. Pastikan PostgreSQL berjalan
2. Pastikan backend berjalan (`http://localhost:4000`)
3. Pastikan frontend berjalan (`http://localhost:5173`)
4. Buka browser dan akses `http://localhost:5173`

---

## 📁 Struktur Proyek

```
prediksi-kualitas-udara/
├── README.md                   # Dokumentasi utama
│
├── backend/                    # Backend API (Node.js + Express)
│   ├── index.js                # Entry point server
│   ├── package.json            # Dependencies backend
│   ├── .env                    # Environment variables
│   │
│   ├── db/
│   │   ├── config.js           # Koneksi PostgreSQL
│   │   ├── init.js             # Script init database
│   │   └── queries.js          # Query functions
│   │
│   └── routes/
│       ├── auth.js             # Routes authentication
│       ├── predictions.js      # Routes predictions
│       └── history.js          # Routes history
│
└── FE-aja/                     # Frontend (React + Vite)
    ├── index.html              # Entry point HTML
    ├── package.json            # Dependencies frontend
    ├── vite.config.js          # Konfigurasi Vite
    ├── tailwind.config.cjs     # Konfigurasi Tailwind
    ├── postcss.config.cjs      # Konfigurasi PostCSS
    │
    ├── src/
    │   ├── main.jsx            # Entry point React
    │   ├── App.jsx             # Root component
    │   ├── index.css           # Global styles
    │   │
    │   ├── components/         # Komponen reusable
    │   │   ├── Header.jsx
    │   │   ├── BottomNav.jsx
    │   │   ├── HistoryCard.jsx
    │   │   └── InputField.jsx
    │   │
    │   ├── pages/              # Halaman utama
    │   │   ├── WelcomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── PredictionPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   └── SuccessPage.jsx
    │   │
    │   └── styles/
    │       └── globals.css
    │
    └── public/                 # Static assets
        └── assets/
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/google` | Login dengan Google OAuth |
| `GET` | `/api/auth/me` | Ambil info user yang login |
| `POST` | `/api/auth/logout` | Logout user |

### Predictions
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/predictions` | Ambil semua prediksi user |
| `POST` | `/api/predictions` | Simpan prediksi baru |
| `GET` | `/api/predictions/:id` | Ambil detail satu prediksi |
| `DELETE` | `/api/predictions/:id` | Hapus prediksi |

### History
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/history` | Ambil riwayat aktivitas user |

---

## 🖼️ Screenshot

> _Tambahkan screenshot aplikasi di sini_

---

## 🐛 Troubleshooting

### Error: "ECONNREFUSED" saat connect ke database
- Pastikan PostgreSQL sudah berjalan
- Cek konfigurasi `DATABASE_URL` di file `.env`
- Pastikan password database benar

### Error: "Google login gagal"
- Pastikan `GOOGLE_CLIENT_ID` sudah dikonfigurasi
- Cek authorized origins di Google Cloud Console
- Pastikan backend berjalan di port yang benar

### Port 4000/5173 sudah digunakan
- Ganti port di file konfigurasi
- Atau matikan proses yang menggunakan port tersebut

---

## 👥 Kontributor

- **Silvok** - Developer

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan Tugas Besar Mata Kuliah Pembelajaran Mesin.

---

<p align="center">
  Made with ❤️ using React + Node.js + PostgreSQL
</p>
