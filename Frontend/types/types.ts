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

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  address: string;
}

export interface UserDetails {
  id: number;
  username: string;
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
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  token: string;
}
