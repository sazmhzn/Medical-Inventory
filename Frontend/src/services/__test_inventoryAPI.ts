// src/services/inventoryApi.ts

import axios from "axios";
import { useAuthState } from "@/utils/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080/mis/inventory";

// Create a factory function for the API that takes credentials
const createInventoryApi = (base64Credentials: string | null) => ({
  async getAllInventory() {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async getInventoryById(id: string) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async createInventoryItem(itemData: Record<string, any>) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.post(`${BASE_URL}/save`, itemData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async updateInventoryItem(id: string, itemData: Record<string, any>) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.put(`${BASE_URL}/update/${id}`, itemData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async deleteInventoryItem(id: string) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },
});

// Custom hook to use the inventory API with auth
const useInventoryApi = () => {
  const { getCredentials, isAuthenticated } = useAuthState();
  console.log(getCredentials());
  if (!isAuthenticated) {
    throw new Error("Authentication required to use inventory API");
  }

  return createInventoryApi(getCredentials());
};

// Query keys (keep your existing keys)
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

// Custom hooks for inventory operations
export const useInventory = (enabled = true) => {
  const inventoryApi = useInventoryApi();

  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: () => inventoryApi.getAllInventory(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInventoryItem = (id: string | undefined, enabled = true) => {
  const inventoryApi = useInventoryApi();

  return useQuery({
    queryKey: inventoryKeys.detail(id!),
    queryFn: () => inventoryApi.getInventoryById(id!),
    enabled: Boolean(id) && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  const inventoryApi = useInventoryApi();

  return useMutation({
    mutationFn: (newItem: Record<string, any>) =>
      inventoryApi.createInventoryItem(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  const inventoryApi = useInventoryApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      inventoryApi.updateInventoryItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  const inventoryApi = useInventoryApi();

  return useMutation({
    mutationFn: (id: string) => inventoryApi.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

// Test function for the inventory API
export const testInventoryApi = async (username: string, password: string) => {
  const testCredentials = btoa(`${username}:${password}`);
  const api = createInventoryApi(testCredentials);

  try {
    // Test getting all inventory items
    const items = await api.getAllInventory();
    console.log("Test successful:", items);
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};
