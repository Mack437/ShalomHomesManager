import { db } from './db';
import { 
  users, properties, apartments, tasks, transactions, activities,
  type User, type Property, type Apartment, type Task, type Transaction, type Activity,
  type InsertUser, type InsertProperty, type InsertApartment, type InsertTask, type InsertTransaction, type InsertActivity
} from '@shared/schema';
import { IStorage } from './storage';
import { eq, sql } from 'drizzle-orm';
import { log } from './vite';
import * as bcrypt from 'bcryptjs';

export class DbStorage implements IStorage {
  async init() {
    try {
      // Check if we need to seed data
      const result = await db.execute(sql`SELECT COUNT(*) FROM users`);
      const userCount = parseInt(result.rows[0].count || '0');
      
      log(`Current user count: ${userCount}`);
      
      if (userCount === 0) {
        await this.seedDatabase();
      }
    } catch (error) {
      // If the table doesn't exist yet, seed data
      log(`Error checking users table: ${error}`);
      await this.seedDatabase();
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  
  async getProperties(): Promise<Property[]> {
    return db.select().from(properties);
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }
  
  // Apartment methods
  async getApartment(id: number): Promise<Apartment | undefined> {
    const [apartment] = await db.select().from(apartments).where(eq(apartments.id, id));
    return apartment;
  }
  
  async getApartmentsByProperty(propertyId: number): Promise<Apartment[]> {
    return db.select().from(apartments).where(eq(apartments.propertyId, propertyId));
  }
  
  async createApartment(insertApartment: InsertApartment): Promise<Apartment> {
    const [apartment] = await db.insert(apartments).values(insertApartment).returning();
    return apartment;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }
  
  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks);
  }
  
  async getTasksByProperty(propertyId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.propertyId, propertyId));
  }
  
  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.assignedToId, userId));
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }
  
  async updateTaskStatus(id: number, status: string): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ 
        status: status, 
        completedAt: status === 'completed' ? new Date() : null 
      })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }
  
  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions);
  }
  
  async getTransactionsByTenant(tenantId: number): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.tenantId, tenantId));
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }
  
  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    let query = db.select().from(activities).orderBy(activities.createdAt);
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return query;
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }

  // Seed database with initial data
  private async seedDatabase() {
    try {
      log("Seeding database with initial data...");
      
      // Hash passwords
      const adminPassword = await bcrypt.hash('admin123', 10);
      const familyPassword = await bcrypt.hash('Family1400', 10);
      
      // Create admin user
      const adminUser = await this.createUser({
        username: 'admin',
        email: 'admin@shalomhomes.com',
        name: 'Administrator',
        password: adminPassword,
        role: 'owner',
        phone: null,
        googleId: null
      });
      
      // Create another admin user with specified credentials
      const familyAdmin = await this.createUser({
        username: 'familyadmin',
        email: 'family@shalomhomes.com',
        name: 'Family Admin',
        password: familyPassword,
        role: 'owner',
        phone: null,
        googleId: null
      });
      
      // Create sample property
      const property1 = await this.createProperty({
        name: 'Skyview Apartments',
        address: '123 Main Street',
        city: 'New York',
        district: 'Manhattan',
        status: 'active',
        type: 'apartment',
        price: 250000,
        bedrooms: 2,
        bathrooms: 2,
        size: 1200,
        latitude: 40.7128,
        longitude: -74.0060
      });
      
      // Create sample apartment
      const apartment1 = await this.createApartment({
        propertyId: property1.id,
        number: '101',
        status: 'vacant',
        price: 1500,
        tenantId: null
      });
      
      // Create sample task
      const task1 = await this.createTask({
        title: 'Fix leaking faucet',
        description: 'The faucet in apartment 101 is leaking and needs to be fixed.',
        status: 'open',
        priority: 'medium',
        type: 'maintenance',
        propertyId: property1.id,
        apartmentId: apartment1.id,
        assignedToId: adminUser.id,
        reportedById: adminUser.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        completedAt: null
      });
      
      log("Database seeded successfully!");
    } catch (error) {
      log(`Error seeding database: ${error}`);
    }
  }
}