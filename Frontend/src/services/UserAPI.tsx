import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/user";
const base64Credentials = btoa("admin:admin123"); // Encode username and password

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
// Custom Hook for Fetching Inventory Data
export const useFetchAllUser = (endpoint: string) => {
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

export const useFetchSuppliers = () => {
  const [data, setData] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
      // Filter users with SUPPLIER role
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
