import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  apartments, type Apartment, type InsertApartment,
  tasks, type Task, type InsertTask,
  transactions, type Transaction, type InsertTransaction,
  activities, type Activity, type InsertActivity
} from "@shared/schema";
import * as bcrypt from 'bcryptjs';

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Apartment methods
  getApartment(id: number): Promise<Apartment | undefined>;
  getApartmentsByProperty(propertyId: number): Promise<Apartment[]>;
  createApartment(apartment: InsertApartment): Promise<Apartment>;
  
  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getTasks(): Promise<Task[]>;
  getTasksByProperty(propertyId: number): Promise<Task[]>;
  getTasksByAssignee(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskStatus(id: number, status: string): Promise<Task | undefined>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByTenant(tenantId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private propertiesMap: Map<number, Property>;
  private apartmentsMap: Map<number, Apartment>;
  private tasksMap: Map<number, Task>;
  private transactionsMap: Map<number, Transaction>;
  private activitiesMap: Map<number, Activity>;
  private currentIds: {
    user: number;
    property: number;
    apartment: number;
    task: number;
    transaction: number;
    activity: number;
  };

  constructor() {
    this.usersMap = new Map();
    this.propertiesMap = new Map();
    this.apartmentsMap = new Map();
    this.tasksMap = new Map();
    this.transactionsMap = new Map();
    this.activitiesMap = new Map();
    this.currentIds = {
      user: 1,
      property: 1,
      apartment: 1,
      task: 1,
      transaction: 1,
      activity: 1
    };
    
    // Add default admin users
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@shalomhomes.com",
      name: "Admin",
      role: "owner",
      phone: "+1234567890",
      googleId: null
    });

    // Add new admin user with custom credentials
    this.createUser({
      username: "admin",
      password: "Family1400",
      email: "admin@example.com",
      name: "Admin User",
      role: "owner",
      phone: "+9876543210",
      googleId: null
    });
    
    // Add sample property
    this.seedSampleData();
  }

  // Seed some initial data for demonstration
  private seedSampleData() {
    // Create properties
    const property1 = this.createProperty({
      name: "Shalom Heights",
      address: "123 Shalom St",
      city: "Jerusalem",
      district: "Central District",
      status: "active",
      type: "apartment",
      price: 1200,
      bedrooms: 2,
      bathrooms: 1,
      size: 75,
      latitude: 31.768319,
      longitude: 35.213710
    });
    
    const property2 = this.createProperty({
      name: "Garden Villas",
      address: "456 Garden Ave",
      city: "Tel Aviv",
      district: "Central District",
      status: "active",
      type: "apartment",
      price: 1450,
      bedrooms: 3,
      bathrooms: 2,
      size: 95,
      latitude: 32.0853,
      longitude: 34.7818
    });
    
    const property3 = this.createProperty({
      name: "Shalom Towers",
      address: "789 Tower Rd",
      city: "Haifa",
      district: "Northern District",
      status: "active",
      type: "apartment",
      price: 980,
      bedrooms: 1,
      bathrooms: 1,
      size: 55,
      latitude: 32.7940,
      longitude: 34.9896
    });
    
    // Create apartments for properties
    this.createApartment({
      propertyId: property1.id,
      number: "302",
      status: "occupied",
      price: 1200,
      tenantId: null
    });
    
    this.createApartment({
      propertyId: property2.id,
      number: "105",
      status: "maintenance",
      price: 1450,
      tenantId: null
    });
    
    this.createApartment({
      propertyId: property3.id,
      number: "501",
      status: "vacant",
      price: 980,
      tenantId: null
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email
    );
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.googleId === googleId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const now = new Date();
    
    // Hash password if it exists
    let userWithHashedPassword = {...insertUser};
    if (userWithHashedPassword.password) {
      userWithHashedPassword.password = await bcrypt.hash(userWithHashedPassword.password, 10);
    }
    
    const user: User = { 
      ...userWithHashedPassword, 
      id, 
      createdAt: now 
    };
    this.usersMap.set(id, user);
    return user;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }
  
  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.propertiesMap.get(id);
  }
  
  async getProperties(): Promise<Property[]> {
    return Array.from(this.propertiesMap.values());
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentIds.property++;
    const now = new Date();
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: now
    };
    this.propertiesMap.set(id, property);
    return property;
  }
  
  // Apartment methods
  async getApartment(id: number): Promise<Apartment | undefined> {
    return this.apartmentsMap.get(id);
  }
  
  async getApartmentsByProperty(propertyId: number): Promise<Apartment[]> {
    return Array.from(this.apartmentsMap.values()).filter(
      (apartment) => apartment.propertyId === propertyId
    );
  }
  
  async createApartment(insertApartment: InsertApartment): Promise<Apartment> {
    const id = this.currentIds.apartment++;
    const apartment: Apartment = {
      ...insertApartment,
      id
    };
    this.apartmentsMap.set(id, apartment);
    return apartment;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasksMap.get(id);
  }
  
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasksMap.values());
  }
  
  async getTasksByProperty(propertyId: number): Promise<Task[]> {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.propertyId === propertyId
    );
  }
  
  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.assignedToId === userId
    );
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentIds.task++;
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: now,
      completedAt: null
    };
    this.tasksMap.set(id, task);
    return task;
  }
  
  async updateTaskStatus(id: number, status: string): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    const updatedTask: Task = {
      ...task,
      status,
      completedAt: status === 'completed' ? new Date() : task.completedAt
    };
    
    this.tasksMap.set(id, updatedTask);
    return updatedTask;
  }
  
  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactionsMap.get(id);
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactionsMap.values());
  }
  
  async getTransactionsByTenant(tenantId: number): Promise<Transaction[]> {
    return Array.from(this.transactionsMap.values()).filter(
      (transaction) => transaction.tenantId === tenantId
    );
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentIds.transaction++;
    const now = new Date();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: now
    };
    this.transactionsMap.set(id, transaction);
    return transaction;
  }
  
  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activitiesMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    return limit ? activities.slice(0, limit) : activities;
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentIds.activity++;
    const now = new Date();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: now
    };
    this.activitiesMap.set(id, activity);
    return activity;
  }
}

// Create a proxy storage that delegates to the current implementation
class StorageProxy implements IStorage {
  private _implementationInstance: IStorage = new MemStorage();

  set implementationInstance(implementation: IStorage) {
    this._implementationInstance = implementation;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this._implementationInstance.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this._implementationInstance.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this._implementationInstance.getUserByEmail(email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return this._implementationInstance.getUserByGoogleId(googleId);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this._implementationInstance.createUser(user);
  }

  async getUsers(): Promise<User[]> {
    return this._implementationInstance.getUsers();
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this._implementationInstance.getProperty(id);
  }

  async getProperties(): Promise<Property[]> {
    return this._implementationInstance.getProperties();
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    return this._implementationInstance.createProperty(property);
  }

  // Apartment methods
  async getApartment(id: number): Promise<Apartment | undefined> {
    return this._implementationInstance.getApartment(id);
  }

  async getApartmentsByProperty(propertyId: number): Promise<Apartment[]> {
    return this._implementationInstance.getApartmentsByProperty(propertyId);
  }

  async createApartment(apartment: InsertApartment): Promise<Apartment> {
    return this._implementationInstance.createApartment(apartment);
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this._implementationInstance.getTask(id);
  }

  async getTasks(): Promise<Task[]> {
    return this._implementationInstance.getTasks();
  }

  async getTasksByProperty(propertyId: number): Promise<Task[]> {
    return this._implementationInstance.getTasksByProperty(propertyId);
  }

  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return this._implementationInstance.getTasksByAssignee(userId);
  }

  async createTask(task: InsertTask): Promise<Task> {
    return this._implementationInstance.createTask(task);
  }

  async updateTaskStatus(id: number, status: string): Promise<Task | undefined> {
    return this._implementationInstance.updateTaskStatus(id, status);
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this._implementationInstance.getTransaction(id);
  }

  async getTransactions(): Promise<Transaction[]> {
    return this._implementationInstance.getTransactions();
  }

  async getTransactionsByTenant(tenantId: number): Promise<Transaction[]> {
    return this._implementationInstance.getTransactionsByTenant(tenantId);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    return this._implementationInstance.createTransaction(transaction);
  }

  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    return this._implementationInstance.getActivities(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    return this._implementationInstance.createActivity(activity);
  }
}

export const storage = new StorageProxy();
