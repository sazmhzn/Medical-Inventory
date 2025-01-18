import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthState } from "@/utils/AuthProvider";
import { Supplier } from "types/types";

const BASE_URL = "http://localhost:8080/mis/user";

// Create a factory function for the API that takes credentials
const createSupplierApi = (base64Credentials: string | null) => ({
  async getAllSuppliers(): Promise<Supplier[]> {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}/role/supplier`, {
      headers: { Authorization: `Basic ${base64Credentials}` },
    });
    return data;
  },

  async getSupplierById(id: string): Promise<Supplier> {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Basic ${base64Credentials}` },
    });
    return data;
  },

  async createSupplier(supplierData: FormData): Promise<Supplier> {
    if (!base64Credentials) throw new Error("Authentication required");
    console.log(supplierData);
    const { data } = await axios.post(`${BASE_URL}/addSupplier`, supplierData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async updateSupplier(id: string, supplierData: FormData): Promise<Supplier> {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.put(`${BASE_URL}/${id}`, supplierData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async deleteSupplier(id: string): Promise<void> {
    if (!base64Credentials) throw new Error("Authentication required");
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Basic ${base64Credentials}` },
    });
  },
});

// Custom hook to use the supplier API with auth
const useSupplierApi = () => {
  const { getCredentials, isAuthenticated } = useAuthState();

  if (!isAuthenticated) {
    throw new Error("Authentication required to use supplier API");
  }

  return createSupplierApi(getCredentials());
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
  const supplierApi = useSupplierApi();

  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: () => supplierApi.getAllSuppliers(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSupplier = (id: string | undefined, enabled = true) => {
  const supplierApi = useSupplierApi();

  return useQuery({
    queryKey: supplierKeys.detail(id!),
    queryFn: () => supplierApi.getSupplierById(id!),
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const supplierApi = useSupplierApi();

  return useMutation({
    mutationFn: (data: FormData) => supplierApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const supplierApi = useSupplierApi();

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
  const supplierApi = useSupplierApi();

  return useMutation({
    mutationFn: (id: string) => supplierApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
};

// Test function for the supplier API
export const testSupplierApi = async (username: string, password: string) => {
  const testCredentials = btoa(`${username}:${password}`);
  const api = createSupplierApi(testCredentials);

  try {
    const suppliers = await api.getAllSuppliers();
    console.log("Test successful:", suppliers);
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};
