// supplierAPI.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Supplier } from "types/types";
import { z } from "zod";

const BASE_URL = "http://localhost:8080/mis/user";
const base64Credentials = btoa("admin:admin123");

// API client
const supplierApi = {
  async getAllSuppliers(): Promise<Supplier[]> {
    const { data } = await axios.get(`${BASE_URL}/role/supplier`, {
      headers: { Authorization: `Basic ${base64Credentials}` },
    });
    return data;
  },

  async getSupplierById(id: string): Promise<Supplier> {
    const { data } = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Basic ${base64Credentials}` },
    });
    return data;
  },

  async createSupplier(supplierData: FormData): Promise<Supplier> {
    const { data } = await axios.post(`${BASE_URL}/save`, supplierData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async updateSupplier(id: string, supplierData: FormData): Promise<Supplier> {
    const { data } = await axios.put(`${BASE_URL}/${id}`, supplierData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async deleteSupplier(id: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Basic ${base64Credentials}` },
    });
  },
};

// Query keys
export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (filters: string) => [...supplierKeys.lists(), { filters }] as const,
  details: () => [...supplierKeys.all, "detail"] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
};

// React Query Hooks
export const useSuppliers = (enabled = true) => {
  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: () => supplierApi.getAllSuppliers(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSupplier = (id: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: supplierKeys.detail(id!),
    queryFn: () => supplierApi.getSupplierById(id!),
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => supplierApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      supplierApi.updateSupplier(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};
