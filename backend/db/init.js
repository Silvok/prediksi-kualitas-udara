import pool from './config.js';

// SQL untuk membuat tabel
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initializing database tables...');

    // Tabel Users - untuk menyimpan data pengguna (termasuk Google OAuth)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        picture VARCHAR(500),
        provider VARCHAR(50) DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "users" created/verified');

    // Tabel Predictions - untuk menyimpan riwayat prediksi kualitas udara
    // Catatan: Jika perlu reset tabel, uncomment baris DROP di bawah
    // await client.query(`DROP TABLE IF EXISTS predictions CASCADE;`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        suhu REAL NOT NULL,
        kelembapan REAL NOT NULL,
        tekanan REAL NOT NULL,
        kecepatan_angin REAL NOT NULL,
        kualitas VARCHAR(50) NOT NULL,
        score INTEGER,
        confidence REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "predictions" created/verified');

    // Tabel History - untuk log aktivitas pengguna
    await client.query(`
      CREATE TABLE IF NOT EXISTS history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "history" created/verified');

    // Index untuk performa query
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
      CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `);
    console.log('✅ Indexes created/verified');

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Jalankan inisialisasi
createTables()
  .then(() => {
    console.log('Database setup finished successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
