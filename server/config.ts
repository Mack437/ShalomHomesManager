import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-secret-key',
  PORT: process.env.PORT || 5000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  // Set the callback URL to match your application - adjust in production
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
};

// Validate required environment variables
if (!env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is required');
  process.exit(1);
}

// Check if Google OAuth credentials are available
if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
  console.warn('Warning: Google OAuth credentials not set. Google authentication will not work.');
}