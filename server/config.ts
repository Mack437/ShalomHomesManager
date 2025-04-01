import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-secret-key',
  PORT: process.env.PORT || 5000
};

// Validate required environment variables
if (!env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is required');
  process.exit(1);
}