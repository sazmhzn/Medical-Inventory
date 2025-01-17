// import axios from "axios";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const BASE_URL = "http://localhost:8080/mis/order";
// const base64Credentials = btoa("admin:admin123");

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Basic ${base64Credentials}`,
//     "Content-Type": "application/json",
//   },
// });

// const orderApi = {
//   getAll: async () => {
//     const { data } = await axiosInstance.get("");
//     return data;
//   },
//   getById: async (id: string) => {
//     const { data } = await axiosInstance.get(`/${id}`);
//     return data;
//   },
//   getPendingOrders: async () => {
//     const { data } = await axiosInstance.get("/pending");
//     return data;
//   },
//   updateStatus: async ({
//     orderId,
//     status,
//   }: {
//     orderId: number;
//     status: string;
//   }) => {
//     const response = await axiosInstance.put(`/${orderId}/status`, {
//       status,
//     });
//     return response.data.data;
//   },
//   create: async (orderData: any) => {
//     const { data } = await axiosInstance.post("/save", orderData);
//     return data;
//   },
//   delete: async (id: string) => {
//     await axiosInstance.delete(`/${id}`);
//   },
//   bulkDelete: async (ids: string[]) => {
//     await axiosInstance.delete("/bulk-delete", { data: ids });
//   },
// };

// export const orderKeys = {
//   all: ["orders"] as const,
//   lists: () => [...orderKeys.all, "list"] as const,
//   list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
//   details: () => [...orderKeys.all, "detail"] as const,
//   detail: (id: string) => [...orderKeys.details(), id] as const,
// };

// export const useOrders = () =>
//   useQuery({
//     queryKey: orderKeys.lists(),
//     queryFn: orderApi.getAll,
//   });

// export const useOrder = (id: string) =>
//   useQuery({
//     queryKey: orderKeys.detail(id),
//     queryFn: () => orderApi.getById(id),
//     enabled: !!id,
//   });

// export const useCreateOrder = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: orderApi.create,
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
//   });
// };

// export const useDeleteOrders = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: orderApi.bulkDelete,
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
//   });
// };

// // Update the API response handling in the React components
// export const usePendingOrders = () =>
//   useQuery({
//     queryKey: [...orderKeys.lists(), "pending"],
//     queryFn: orderApi.getPendingOrders,
//     select: (data) =>
//       data?.map((order) => ({
//         ...order,
//         items: order.itemDetails || [], // Map itemDetails to items for consistency
//       })),
//   });

// export const useUpdateOrderStatus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: orderApi.updateStatus,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
//       queryClient.invalidateQueries({
//         queryKey: [...orderKeys.lists(), "pending"],
//       });
//     },
//   });
// };

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
      const { data } = await axiosInstance.get("");
      return data;
    },

    async getById(id: string) {
      if (!base64Credentials) throw new Error("Authentication required");
      const { data } = await axiosInstance.get(`/${id}`);
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
    }: {
      orderId: number;
      status: string;
    }) {
      if (!base64Credentials) throw new Error("Authentication required");
      const response = await axiosInstance.put(`/${orderId}/status`, {
        status,
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
    select: (data: OrderItem[]) =>
      data?.map((order) => ({
        ...order,
        items: order.itemDetails || [],
      })),
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
