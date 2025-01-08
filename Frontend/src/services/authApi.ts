// src/api/auth.ts

import { AuthUser, LoginCredentials } from "types/types";
import { apiClient } from "./api-client";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    const token = btoa(`${credentials.username}:${credentials.password}`);
    const response = await apiClient.post("/login", null, {
      headers: { Authorization: `Basic ${token}` },
    });

    return {
      ...response.data,
      token,
    };
  },
};
