import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from './config';
import * as schema from '../shared/schema';

// Create a PostgreSQL connection
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL
});

// Create a drizzle instance
export const db = drizzle(pool, { schema });