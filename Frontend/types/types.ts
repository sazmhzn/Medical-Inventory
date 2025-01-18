import { z } from "zod";

export interface Inventory {
  id: number;
  name: string;
  description: string;
  sku: string;
  unit: string;
  type: "GOODS" | "SERVICE";
  stock: number;
  price: number;
  reorder: number;
  expiryDate?: string;
  manufacturer: string;
  batchNumber: string;
  category: string;
  storageConditions?: string;
  image?: string;
  createdDate: string;
  lastUpdatedDate: string;
}

export interface OrderItem {
  id: number;
  inventoryId: number;
  name: string;
  sku?: string;
  qty: number;
  rate: number;
  tax?: number;
  amount?: number;
}

export interface Order {
  id: string;
  status: string;
  orderDate: string;
  items: any[];
  totalAmount: number;
}

export interface Supplier {
  id: number;
  username: string;
  password: string;
  roles: string;
  orgName: string;
  image: string;
  name: string;
  emailAddress: string;
  contact: string;
  address: string;
  createdDate: string;
  lastUpdatedDate: string;
}

export interface UserDetails {
  id: number;
  username: string;
  password: string;
  roles: string;
  orgName: string;
  image: string;
  name: string;
  contact: string;
  address: string;
  createdDate: string;
  lastUpdatedDate: string;
}

// src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password?: string;
  otp?: string;
  role: UserRole;
  authMethod: "password" | "otp";
}

export interface OtpRequest {
  email: string;
  role: UserRole;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  address: string;
  name: string;
  orgName?: string;
  contact?: string;
  emailAddress: string;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  emailAddress: string;
  orgName: string;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  INVENTORY_MANAGER = "ADMIN",
  SUPPLIER = "SUPPLIER",
  CUSTOMER = "CUSTOMER",
}
