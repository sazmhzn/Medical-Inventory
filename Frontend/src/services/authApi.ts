// src/api/auth.ts
import { LoginCredentials, OtpRequest, RegisterCredentials } from "types/types";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080/mis/auth";

const authApi = {
  async login(credentials: LoginCredentials) {
    if (credentials.authMethod === "password") {
      const { data } = await axios.post(`${BASE_URL}/login`, {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      });
      return { ...data, credentials };
    } else {
      const { data } = await axios.post(`${BASE_URL}/verify-otp`, {
        email: credentials.email,
        password: credentials.password,
        otp: credentials.otp,
        role: credentials.role,
      });
      return data;
    }
  },

  async register(userData: RegisterCredentials) {
    const { data } = await axios.post(`${BASE_URL}/register`, userData);
    return { ...data, userData };
  },

  async sendOtp(request: OtpRequest) {
    const { data } = await axios.post(`${BASE_URL}/send-otp`, request);
    return data;
  },
};

// Query key factory
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

// Custom hook for managing auth state
export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (user) => {
      // Store user data in localStorage
      console.log(user);
      user.bota = btoa(`${user.username}:${user.credentials.password}`);
      localStorage.setItem("user", JSON.stringify(user));
      // Update query cache
      queryClient.setQueryData(authKeys.user(), user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterCredentials) => authApi.register(userData),
    onSuccess: (user) => {
      user.bota = btoa(`${user.username}:${user.userData.password}`);
      localStorage.setItem("user", JSON.stringify(user));
      queryClient.setQueryData(authKeys.user(), user);
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (request: OtpRequest) => authApi.sendOtp(request),
  });

  const logout = () => {
    localStorage.removeItem("user");
    queryClient.setQueryData(authKeys.user(), null);
    queryClient.clear(); // Clear all queries on logout
  };

  return {
    loginMutation,
    registerMutation,
    sendOtpMutation,
    logout,
  };
};
