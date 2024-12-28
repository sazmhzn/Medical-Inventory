import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth"; // Replace with your Spring Boot backend URL

// Define the structure of responses (adjust as needed)
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Service for login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Service for verifying OTP
export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
    return response.data.success;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

// Service for resetting password
export const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, { email, newPassword });
    return response.data.success;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};
