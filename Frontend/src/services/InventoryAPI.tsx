import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/inventory";
const base64Credentials = btoa("admin:admin123"); // Encode username and password

// Custom Hook for Fetching Inventory Data
export const useFetchInventory = (endpoint: string) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
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

export const useFetchInventoryById = (id: string | undefined) => {
  const [data, setData] = useState<any>(null); // Adjust type if API response is known
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
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

export const postInventoryItem = async (data: Record<string, any>) => {
  try {
    const response = await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optionally add Authorization header here if needed:
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit the data");
    }

    return await response.json(); // Return the response as JSON
  } catch (error) {
    throw new Error(error.message || "Error submitting the form");
  }
};

export const deleteInventoryItem = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        // Optionally add Authorization header if needed:
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the inventory item");
    }

    return await response.json(); // Return the response as JSON
  } catch (error) {
    throw new Error(error.message || "Error deleting the item");
  }
};

export const updateInventoryItem = async (
  id: string | number,
  data: Record<string, any>
) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update the item");
    }

    return response.data; // Return the updated item data
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "An error occurred while updating the item"
    );
  }
};
