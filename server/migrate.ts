import { db } from "./db";
import { log } from "./vite";
import { sql } from "drizzle-orm";

async function main() {
  log("Running migrations...");
  
  try {
    // This would normally use migrations from the 'migrations' folder
    // For simplicity, we'll use the schema directly in this file
    
    // Create all tables from our schema - running each statement separately
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "role" TEXT NOT NULL DEFAULT 'client',
        "google_id" TEXT UNIQUE,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "properties" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "district" TEXT,
        "status" TEXT NOT NULL DEFAULT 'vacant',
        "type" TEXT NOT NULL,
        "price" INTEGER NOT NULL,
        "bedrooms" INTEGER,
        "bathrooms" INTEGER,
        "size" INTEGER,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "apartments" (
        "id" SERIAL PRIMARY KEY,
        "property_id" INTEGER NOT NULL,
        "number" TEXT NOT NULL,
        "tenant_id" INTEGER,
        "status" TEXT NOT NULL DEFAULT 'vacant',
        "price" INTEGER NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'open',
        "priority" TEXT NOT NULL DEFAULT 'medium',
        "type" TEXT NOT NULL,
        "property_id" INTEGER NOT NULL,
        "apartment_id" INTEGER,
        "assigned_to_id" INTEGER,
        "reported_by_id" INTEGER,
        "due_date" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "completed_at" TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "transactions" (
        "id" SERIAL PRIMARY KEY,
        "tenant_id" INTEGER NOT NULL,
        "apartment_id" INTEGER,
        "property_id" INTEGER NOT NULL,
        "type" TEXT NOT NULL,
        "amount" INTEGER NOT NULL,
        "payment_method" TEXT NOT NULL,
        "description" TEXT,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
        "processed_by_id" INTEGER NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "activities" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "action" TEXT NOT NULL,
        "entity_type" TEXT NOT NULL,
        "entity_id" INTEGER NOT NULL,
        "details" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    
    log("Migrations completed successfully!");
  } catch (error) {
    log(`Migration error: ${error}`);
    process.exit(1);
  }
}

main();