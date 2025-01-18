import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UserDetails } from "types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "./api-client";

const BASE_URL = "http://localhost:8080/mis/user";
const base64Credentials = btoa("admin:admin123");

// Axios instance for reusable config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Basic ${base64Credentials}`,
    "Content-Type": "application/json",
  },
});

// Custom Hook for Fetching All Users
export const useFetchAllUser = () => {
  const [data, setData] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("");
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom Hook for Fetching Suppliers
export const useFetchSuppliers = () => {
  const [data, setData] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("");
      // Filter users with "SUPPLIER" role
      const suppliers = response.data.filter((user: UserDetails) =>
        user.roles.includes("SUPPLIER")
      );
      setData(suppliers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return { data, loading, error, refetch: fetchSuppliers };
};

// Function to Fetch a User by ID
export const useFetchUserById = async (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Function to Post a New User
export const postUser = async (user: UserDetails) => {
  try {
    const response = await axiosInstance.post("/save", user);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error submitting the user"
    );
  }
};

// Function to Delete a User by ID
export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting the user"
    );
  }
};

// Function to Update a User
export const updateUser = async (id: string, user: Record<string, any>) => {
  try {
    const response = await axiosInstance.put(`/profile/${id}`, user);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating the user"
    );
  }
};

export const useUsers = (token: string) => {
  const client = createApiClient(token);

  const queryClient = useQueryClient();

  // Fetch all users
  const useAllUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const response = await client.get("/user");
        return response.data as UserDetails[];
      },
    });
  };

  // Fetch suppliers only
  const useSuppliers = () => {
    return useQuery({
      queryKey: ["users", "suppliers"],
      queryFn: async () => {
        const response = await client.get("/user");
        return (response.data as UserDetails[]).filter(
          (user) => user.roles === "SUPPLIER"
        );
      },
    });
  };

  // Fetch user by ID
  const useUserById = (id: string) => {
    return useQuery({
      queryKey: ["users", id],
      queryFn: async () => {
        const response = await client.get(`/user/${id}`);
        return response.data as UserDetails;
      },
    });
  };

  // Create user mutation
  const useCreateUser = () => {
    return useMutation({
      mutationFn: async (user: Omit<UserDetails, "id">) => {
        const response = await client.post("/user/save", user);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Update user mutation
  const useUpdateUser = () => {
    return useMutation({
      mutationFn: async ({ id, user }: { id: string; user: UserDetails }) => {
        const response = await client.put(`/user/${id}`, user);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  // Delete user mutation
  const useDeleteUser = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const response = await client.delete(`/user/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  return {
    useAllUsers,
    useSuppliers,
    useUserById,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
  };
};
