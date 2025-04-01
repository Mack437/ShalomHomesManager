import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define custom types
export type TaskPriority = 'low' | 'medium' | 'high';

// User model and schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("client"),
  googleId: text("google_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  googleId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Property model and schema
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  district: text("district"),
  status: text("status").notNull().default("vacant"),
  type: text("type").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  size: integer("size"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  name: true,
  address: true,
  city: true,
  district: true,
  status: true,
  type: true,
  price: true,
  bedrooms: true,
  bathrooms: true,
  size: true,
  latitude: true,
  longitude: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Apartment model and schema
export const apartments = pgTable("apartments", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  number: text("number").notNull(),
  tenantId: integer("tenant_id"),
  status: text("status").notNull().default("vacant"),
  price: integer("price").notNull(),
});

export const insertApartmentSchema = createInsertSchema(apartments).pick({
  propertyId: true,
  number: true,
  tenantId: true,
  status: true,
  price: true,
});

export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type Apartment = typeof apartments.$inferSelect;

// Task model and schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  type: text("type").notNull(),
  propertyId: integer("property_id").notNull(),
  apartmentId: integer("apartment_id"),
  assignedToId: integer("assigned_to_id"),
  reportedById: integer("reported_by_id"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  type: true,
  propertyId: true,
  apartmentId: true,
  assignedToId: true,
  reportedById: true,
  dueDate: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Transaction model and schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  apartmentId: integer("apartment_id"),
  propertyId: integer("property_id").notNull(),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedById: integer("processed_by_id").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  tenantId: true,
  apartmentId: true,
  propertyId: true,
  type: true,
  amount: true,
  paymentMethod: true,
  description: true,
  notes: true,
  processedById: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Activity model and schema for logging activities
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  action: true,
  entityType: true,
  entityId: true,
  details: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
