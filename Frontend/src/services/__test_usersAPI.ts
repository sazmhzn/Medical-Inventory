import axios from "axios";
import { useAuthState } from "@/utils/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080/mis/user";

// Create a factory function for the API that takes credentials
const createUsersApi = (base64Credentials: string | null) => ({
  async getAllUsers() {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async getUserById(id: string) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async getUsersByRole(role: string) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}/role/${role}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async getAllSuppliers() {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.get(`${BASE_URL}/role`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },

  async createUser(userData: Record<string, any>) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.post(`${BASE_URL}/save`, userData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async addSupplier(supplierData: Record<string, any>) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.post(`${BASE_URL}/addSupplier`, supplierData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async updateUser(id: string, userData: Record<string, any>) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.post(`${BASE_URL}/${id}`, userData, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async deleteUser(id: string) {
    if (!base64Credentials) throw new Error("Authentication required");
    const { data } = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return data;
  },
});

// Custom hook to use the users API with auth
const useUsersApi = () => {
  const { getCredentials, isAuthenticated } = useAuthState();
  const credentials = getCredentials();

  if (!isAuthenticated || !credentials) {
    throw new Error("Authentication required to use users API");
  }

  return createUsersApi(credentials);
};

// Query keys
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (filters: string) => [...usersKeys.lists(), { filters }] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

// Custom hooks for user operations
export const useUsers = (enabled = true) => {
  const usersApi = useUsersApi();

  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: () => usersApi.getAllUsers(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (id: string) => {
  const usersApi = useUsersApi();

  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUsersByRole = (role: string) => {
  const usersApi = useUsersApi();

  return useQuery({
    queryKey: usersKeys.list(role),
    queryFn: () => usersApi.getUsersByRole(role),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllSuppliers = () => {
  const usersApi = useUsersApi();

  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: () => usersApi.getAllSuppliers(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const usersApi = useUsersApi();

  return useMutation({
    mutationFn: (newUser: Record<string, any>) => usersApi.createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useAddSupplier = () => {
  const queryClient = useQueryClient();
  const usersApi = useUsersApi();

  return useMutation({
    mutationFn: (supplierData: Record<string, any>) =>
      usersApi.addSupplier(supplierData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const usersApi = useUsersApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const usersApi = useUsersApi();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};

// Test function for the users API
export const testUsersApi = async (username: string, password: string) => {
  const testCredentials = btoa(`${username}:${password}`);
  const api = createUsersApi(testCredentials);

  try {
    const users = await api.getAllUsers();
    console.log("Test successful:", users);
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};
