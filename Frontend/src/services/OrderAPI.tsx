import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/order";
const base64Credentials = btoa("admin:admin123"); // Encode username and password

// Axios instance for reusable config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Basic ${base64Credentials}`,
    "Content-Type": "application/json",
  },
});

// Custom Hook for Fetching Orders
export const useFetchOrder = () => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>(null);

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

// Custom Hook for Fetching an Order by ID
export const useFetchOrderById = (id: string | undefined) => {
  const [data, setData] = useState<any>(null); // Adjust type if API response is known
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${id}`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Function to Post a New Order
export const postOrder = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.post("/save", data);
    return response.data; // Return the response as JSON
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error submitting the form"
    );
  }
};

// Function to Delete an Order by ID
export const deleteOrder = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data; // Return the response as JSON
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting the item"
    );
  }
};

// Function to Bulk Delete Orders
export const bulkDeleteOrders = async (ids: string[]) => {
  try {
    const response = await axiosInstance.delete("/bulk-delete", {
      data: ids, // Pass the IDs as the request body
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting the items"
    );
  }
};
