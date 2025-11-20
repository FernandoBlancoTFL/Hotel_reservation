import { Pool } from 'pg';

export const createDatabasePool = (): Pool => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'hotel_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  return pool;
};

export const initializeDatabase = async (pool: Pool): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      document_id VARCHAR(50),
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id VARCHAR(255) PRIMARY KEY,
      number VARCHAR(50) UNIQUE NOT NULL,
      type VARCHAR(50) NOT NULL,
      price_amount DECIMAL(10, 2) NOT NULL,
      price_currency VARCHAR(10) NOT NULL,
      capacity INTEGER NOT NULL,
      amenities TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL REFERENCES users(id),
      room_id VARCHAR(255) NOT NULL REFERENCES rooms(id),
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      number_of_guests INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL,
      total_price_amount DECIMAL(10, 2) NOT NULL,
      total_price_currency VARCHAR(10) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
    CREATE INDEX IF NOT EXISTS idx_reservations_room ON reservations(room_id);
    CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in_date, check_out_date);
  `);

  console.log('Database tables initialized successfully');
};