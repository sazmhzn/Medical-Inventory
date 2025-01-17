// src/services/reportApi.ts

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "@/utils/AuthProvider";

const BASE_URL = "http://localhost:8080/mis/reports";

const createReportApi = (base64Credentials: string | null) => {
  if (!base64Credentials) throw new Error("Authentication required");

  return {
    async getAllReports() {
      const { data } = await axios.get(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
      return data;
    },

    async getReportById(id: string) {
      const { data } = await axios.get(`${BASE_URL}/orders/${id}`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });
      return data;
    },

    async createCustomReport(filters: Record<string, any>) {
      const { data } = await axios.post(`${BASE_URL}/custom`, filters, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          "Content-Type": "application/json",
        },
      });
      return data;
    },
  };
};

// Query keys for report-related queries
export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (filters: string) => [...reportKeys.lists(), { filters }] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
};

// Custom hook to create API with auth
const useReportApi = () => {
  const { getCredentials, isAuthenticated } = useAuthState();

  if (!isAuthenticated) {
    throw new Error("Authentication required to use report API");
  }

  return createReportApi(getCredentials());
};

// Hook for fetching all reports
export const useReports = (enabled = true) => {
  const reportApi = useReportApi();

  return useQuery({
    queryKey: reportKeys.lists(),
    queryFn: () => reportApi.getAllReports(),
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook for fetching a specific report by ID
export const useReportById = (id: string | undefined, enabled = true) => {
  const reportApi = useReportApi();

  return useQuery({
    queryKey: reportKeys.detail(id!),
    queryFn: () => reportApi.getReportById(id!),
    enabled: Boolean(id) && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for generating custom reports
export const useCreateCustomReport = () => {
  const reportApi = useReportApi();

  return useMutation({
    mutationFn: (filters: Record<string, any>) =>
      reportApi.createCustomReport(filters),
  });
};

// Test function for the report API
export const testReportApi = async (username: string, password: string) => {
  const testCredentials = btoa(`${username}:${password}`);
  const api = createReportApi(testCredentials);

  try {
    const reports = await api.getAllReports();
    console.log("Test successful:", reports);
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    return false;
  }
};
