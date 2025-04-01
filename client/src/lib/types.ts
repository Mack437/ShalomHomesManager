export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  googleId?: string;
  createdAt: Date;
}

export type UserRole = 'client' | 'owner' | 'caretaker' | 'contractor' | 'handyman';

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  district?: string;
  status: PropertyStatus;
  type: PropertyType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export type PropertyStatus = 'active' | 'inactive' | 'maintenance';
export type PropertyType = 'apartment' | 'house' | 'commercial';

export interface Apartment {
  id: number;
  propertyId: number;
  number: string;
  tenantId?: number;
  status: ApartmentStatus;
  price: number;
}

export type ApartmentStatus = 'vacant' | 'occupied' | 'maintenance';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  propertyId: number;
  apartmentId?: number;
  assignedToId?: number;
  reportedById: number;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export type TaskStatus = 'open' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskType = 'maintenance' | 'inspection' | 'administrative';

export interface Transaction {
  id: number;
  tenantId: number;
  apartmentId?: number;
  propertyId: number;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  notes?: string;
  createdAt: Date;
  processedById: number;
}

export type TransactionType = 'rent' | 'deposit' | 'maintenance' | 'utility' | 'other';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'other';

export interface Activity {
  id: number;
  userId: number;
  action: 'created' | 'updated' | 'deleted';
  entityType: 'property' | 'apartment' | 'task' | 'transaction' | 'user';
  entityId: number;
  details?: string;
  createdAt: Date;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  name: string;
  propertyId: number;
  status: PropertyStatus;
  details?: string;
}

export interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  openTasks: number;
  highPriorityTasks: number;
  monthlyRevenue: number;
  monthName: string;
  revenueGrowth: number;
}

export interface UserWithProperty extends User {
  property?: string;
  apartmentNumber?: string;
}
