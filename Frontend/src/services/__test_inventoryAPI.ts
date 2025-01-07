import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/inventory";
const base64Credentials = btoa("admin:admin123");

// API client functions
const inventoryApi = {
  async getAllInventory() {
    const { data } = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async getInventoryById(id: string) {
    const { data } = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async createInventoryItem(itemData: Record<string, any>) {
    const { data } = await axios.post(`${BASE_URL}/save`, itemData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async updateInventoryItem(id: string, itemData: Record<string, any>) {
    const { data } = await axios.put(`${BASE_URL}/update/${id}`, itemData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async deleteInventoryItem(id: string) {
    const { data } = await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },
};

// Query key factory
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

// Hook for fetching all inventory items
export const useInventory = (enabled = true) => {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: () => inventoryApi.getAllInventory(),
    enabled,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

// Hook for fetching a single inventory item
export const useInventoryItem = (id: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id!),
    queryFn: () => inventoryApi.getInventoryById(id!),
    enabled: Boolean(id) && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for creating a new inventory item
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: Record<string, any>) =>
      inventoryApi.createInventoryItem(newItem),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

// Hook for updating an inventory item
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      inventoryApi.updateInventoryItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

// Hook for deleting an inventory item
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryApi.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};
