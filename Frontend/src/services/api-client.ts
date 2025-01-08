// src/lib/api-client.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/user";

export const createApiClient = (token?: string) => {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Basic ${token}` }),
    },
  });

  return client;
};

export const apiClient = createApiClient();
