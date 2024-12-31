import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/inventory";

// Custom Hook for Fetching Inventory Data
export const useFetchInventory = (endpoint: string) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${endpoint}`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};


export const usePost = (endpoint: string) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${endpoint}`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};



// Inventory Service Functions
export const inventoryService = {
  // Get all inventory items
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific inventory item by ID
  getById: async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new inventory item
  create: async (inventory: Record<string, any>) => {
    try {
      const response = await axios.post(`${BASE_URL}/save`, inventory);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an inventory item by ID
  update: async (id: number, inventory: Record<string, any>) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, inventory);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete an inventory item by ID
  delete: async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
