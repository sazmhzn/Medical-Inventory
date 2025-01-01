import { useState, useEffect, useCallback } from "react";
import axios from "axios";

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

export interface UserDetails {
  id: number;
  username: string;
  name: string;
  contact: string;
  address: string;
  roles: string[];
  createdDate: string;
  lastUpdatedDate: string;
}

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
  const [data, setData] = useState<UserDetails[]>([]);
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
export const updateUser = async (id: string, user: UserDetails) => {
  try {
    const response = await axiosInstance.put(`/${id}`, user);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating the user"
    );
  }
};
