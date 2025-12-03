# 🌤️ Skywise - Sistem Prediksi Kualitas Udara

Aplikasi web untuk memprediksi dan memvalidasi kualitas udara berdasarkan parameter cuaca menggunakan **Machine Learning (Random Forest)**. Dataset berasal dari data kualitas udara Beijing dengan 400.000+ data. Dibangun dengan React + Vite (Frontend), Node.js + Express (Backend), dan Python Flask (ML API).

![Status](https://img.shields.io/badge/status-active-success.svg)
![Platform](https://img.shields.io/badge/platform-web-blue.svg)
![ML](https://img.shields.io/badge/ML-Random%20Forest-orange.svg)

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

### 🤖 Machine Learning untuk Prediksi Kualitas Udara
- Model **Random Forest Classifier** dengan akurasi tinggi
- Dataset **400.000+ data** dari Beijing Air Quality
- Klasifikasi berdasarkan **PM2.5**:
  - **Baik** ✅ : PM2.5 ≤ 35
  - **Sedang** ⚠️ : 35 < PM2.5 ≤ 75
  - **Buruk** ❌ : PM2.5 > 75

### 🎯 Prediksi Kualitas Udara Real-Time
- Validasi kualitas udara berdasarkan 4 parameter utama:
  - **Suhu (°C)** - TEMP dari dataset Beijing
  - **Titik Embun (DEWP)** - Dew Point Temperature
  - **Tekanan Udara (mb)** - PRES (Atmospheric Pressure)
  - **Kecepatan Angin (m/s)** - WSPM (Wind Speed)
- Hasil prediksi dengan **probabilitas** untuk setiap kelas
- **Confidence Score** berdasarkan probabilitas tertinggi

### 📊 Dashboard Riwayat Lengkap
- Lihat semua riwayat validasi sebelumnya
- **Filter** berdasarkan kualitas (Baik/Sedang/Buruk)
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

### Machine Learning (Python)
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Python | 3.10+ | Runtime |
| Flask | 2.3+ | API Framework |
| Scikit-learn | 1.3+ | ML Library |
| Pandas | 2.0+ | Data Processing |
| imbalanced-learn | 0.11+ | SMOTE Oversampling |

---

## 📦 Prasyarat

Pastikan Anda sudah menginstall:

- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **Python** (v3.10 atau lebih baru) - [Download](https://python.org/)
- **npm** atau **yarn** (sudah termasuk dengan Node.js)
- **PostgreSQL** (v15 atau lebih baru) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Google Cloud Console** account untuk OAuth credentials (opsional)

---

## 🚀 Instalasi & Setup

### Langkah 1: Clone Repository

```bash
git clone https://github.com/Silvok/prediksi-kualitas-udara.git
cd prediksi-kualitas-udara
```

### Langkah 2: Setup Python ML API (WAJIB)

```bash
# Masuk ke folder ML
cd prediksi_udara

# Buat virtual environment (opsional tapi direkomendasikan)
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies Python
pip install -r requirements.txt

# Masuk ke folder Processing_data
cd Processing_data

# Training model (jalankan sekali untuk membuat file model)
python train_model.py

# Jalankan ML API
python api_predict.py
```

ML API akan berjalan di `http://localhost:5000`

### Langkah 3: Setup Database PostgreSQL

1. Buka **pgAdmin** atau **psql** terminal
2. Buat database baru:
   ```sql
   CREATE DATABASE skywise_db;
   ```

### Langkah 4: Setup Backend Node.js

Buka terminal baru:

```bash
# Masuk ke folder backend (dari root project)
cd backend

# Install dependencies
npm install
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

# ML API URL
ML_API_URL=http://localhost:5000
```

> ⚠️ **Penting**: Ganti `PASSWORD_ANDA` dengan password PostgreSQL Anda!

```bash
# Inisialisasi tabel database
npm run db:init

# Jalankan server backend (development)
npm run dev
```

Backend akan berjalan di `http://localhost:4000`

### Langkah 5: Setup Frontend

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

### Langkah 6: Setup Google OAuth (Opsional)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan **Google+ API** dan **Google Identity Services**
4. Buat **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
5. Copy **Client ID** dan paste ke file `.env` di backend

### Langkah 7: Akses Aplikasi

Pastikan ketiga server berjalan:
1. ✅ **ML API** di `http://localhost:5000`
2. ✅ **Backend** di `http://localhost:4000`
3. ✅ **Frontend** di `http://localhost:5173`

Buka browser dan akses `http://localhost:5173`

---

## 📁 Struktur Proyek

```
prediksi-kualitas-udara/
├── README.md                   # Dokumentasi utama
│
├── prediksi_udara/             # Machine Learning (Python)
│   ├── requirements.txt        # Dependencies Python
│   └── Processing_data/
│       ├── train_model.py      # Script training model
│       ├── api_predict.py      # Flask API untuk prediksi
│       ├── dataset_kualitas_udara_beijing_final.csv  # Dataset
│       ├── model_kualitas_udara_beijing_v3.pkl       # Model tersimpan
│       └── scaler_beijing_v3.pkl                     # Scaler tersimpan
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
| `POST` | `/api/predictions/validate` | **Validasi prediksi dengan ML** (tanpa login) |
| `GET` | `/api/predictions/stats` | Ambil statistik dataset |
| `GET` | `/api/predictions` | Ambil semua prediksi user (perlu login) |
| `POST` | `/api/predictions` | Simpan prediksi baru (perlu login) |
| `GET` | `/api/predictions/:id` | Ambil detail satu prediksi |
| `DELETE` | `/api/predictions/:id` | Hapus prediksi |

### ML API (Python Flask - Port 5000)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/` | Health check ML API |
| `POST` | `/predict` | Prediksi kualitas udara |
| `GET` | `/stats` | Statistik dataset |
| `GET` | `/sample` | Sample data dari dataset |

### History
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/history` | Ambil riwayat aktivitas user |

---

## 📊 Tentang Dataset & Model

### Dataset
- **Sumber**: Beijing Air Quality Dataset
- **Total Data**: 411.625 baris
- **Distribusi**:
  - Baik: 194.710 (47.3%)
  - Sedang: 99.829 (24.3%)
  - Buruk: 117.086 (28.4%)

### Parameter Input
| Parameter | Nama Asli | Range Dataset |
|-----------|-----------|---------------|
| Suhu | TEMP | -17°C sampai 41°C |
| Titik Embun | DEWP | -40 sampai 28 |
| Tekanan | PRES | 991 - 1042 mb |
| Kec. Angin | WSPM | 0 - 13 m/s |

### Model Machine Learning
- **Algoritma**: Random Forest Classifier
- **n_estimators**: 400
- **max_depth**: 18
- **Preprocessing**: MinMaxScaler + SMOTE Oversampling

---

## 🖼️ Screenshot

> _Tambahkan screenshot aplikasi di sini_

---

## 🐛 Troubleshooting

### Error: "ML API tidak tersedia"
- Pastikan Python API berjalan di port 5000
- Jalankan `python api_predict.py` di folder `prediksi_udara/Processing_data`
- Pastikan model sudah di-training dengan `python train_model.py`

### Error: "Model belum dimuat"
- Jalankan training model terlebih dahulu:
  ```bash
  cd prediksi_udara/Processing_data
  python train_model.py
  ```

### Error: "ECONNREFUSED" saat connect ke database
- Pastikan PostgreSQL sudah berjalan
- Cek konfigurasi `DATABASE_URL` di file `.env`
- Pastikan password database benar

### Error: "Google login gagal"
- Pastikan `GOOGLE_CLIENT_ID` sudah dikonfigurasi
- Cek authorized origins di Google Cloud Console
- Pastikan backend berjalan di port yang benar

### Port 4000/5000/5173 sudah digunakan
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
