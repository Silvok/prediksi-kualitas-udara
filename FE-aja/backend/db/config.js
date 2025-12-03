import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Konfigurasi koneksi PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Atau gunakan konfigurasi terpisah:
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT) || 5432,
  // user: process.env.DB_USER || 'postgres',
  // password: process.env.DB_PASSWORD || 'password',
  // database: process.env.DB_NAME || 'skywise_db',
  
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test koneksi
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

export default pool;
