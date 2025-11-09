import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

require('dotenv').config({path: path.resolve(__dirname, '../../.env') });

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;