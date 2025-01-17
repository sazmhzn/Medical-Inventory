// src/types/auth.ts
export interface User {
  id: number;
  bota: string;
  username: string;
  name: string;
  emailAddress: string;
  role: string;
  address: string;
  orgName: string;
  createdDate: string;
  lastUpdatedDate: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  otp?: string;
  role: string;
  authMethod: "password" | "otp";
}

export interface RegisterCredentials {
  // Add your registration fields here
  username: string;
  email: string;
  password: string;
  role: string;
  // ... other fields
}

export interface OtpRequest {
  email: string;
  role: string;
}
