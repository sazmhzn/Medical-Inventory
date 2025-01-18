import axios from "axios";
import { useAuthState } from "@/utils/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderItem } from "types/types";

const BASE_URL = "http://localhost:8080/mis/order";

// Create factory function for the API that takes credentials
const createOrderApi = (base64Credentials: string | null) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Basic ${base64Credentials}`,
      "Content-Type": "application/json",
    },
  });

  return {
    async getAll() {
      if (!base64Credentials) throw new Error("Authentication required");
      const { data } = await axiosInstance.get("/details");
      return data;
    },

    async getById(id: string) {
      if (!base64Credentials) throw new Error("Authentication required");
      const { data } = await axiosInstance.get(`/details/${id}`);
      return data;
    },

    async getPendingOrders() {
      if (!base64Credentials) throw new Error("Authentication required");
      const { data } = await axiosInstance.get("/pending");
      return data;
    },

    async updateStatus({
      orderId,
      status,
      updateInventory = false,
    }: {
      orderId: number;
      status: string;
      updateInventory?: boolean;
    }) {
      if (!base64Credentials) throw new Error("Authentication required");
      const response = await axiosInstance.put(`/${orderId}/status`, {
        status,
        updateInventory,
      });
      return response.data.data;
    },

    async create(orderData: any) {
      if (!base64Credentials) throw new Error("Authentication required");
      const { data } = await axiosInstance.post("/save", orderData);
      return data;
    },

    async delete(id: string) {
      if (!base64Credentials) throw new Error("Authentication required");
      await axiosInstance.delete(`/${id}`);
    },

    async bulkDelete(ids: string[]) {
      if (!base64Credentials) throw new Error("Authentication required");
      await axiosInstance.delete("/bulk-delete", { data: ids });
    },
  };
};

// Custom hook to use the order API with auth
const useOrderApi = () => {
  const { getCredentials, isAuthenticated } = useAuthState();

  if (!isAuthenticated) {
    throw new Error("Authentication required to use order API");
  }

  return createOrderApi(getCredentials());
};

// Keep existing query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Refactored hooks to use the new API
export const useOrders = () => {
  const orderApi = useOrderApi();
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => orderApi.getAll(),
  });
};

export const useOrder = (id: string) => {
  const orderApi = useOrderApi();
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const orderApi = useOrderApi();
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
  });
};

export const useDeleteOrders = () => {
  const queryClient = useQueryClient();
  const orderApi = useOrderApi();
  return useMutation({
    mutationFn: orderApi.bulkDelete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
  });
};

export const usePendingOrders = () => {
  const orderApi = useOrderApi();
  return useQuery({
    queryKey: [...orderKeys.lists(), "pending"],
    queryFn: orderApi.getPendingOrders,
    // select: (data: OrderItem[]) =>
    //   data?.map((order) => ({
    //     ...order,
    //     items: order.itemDetails || [],
    //   })),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const orderApi = useOrderApi();
  return useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...orderKeys.lists(), "pending"],
      });
    },
  });
};
