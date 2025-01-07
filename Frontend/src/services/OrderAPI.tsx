import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080/mis/order";
const base64Credentials = btoa("admin:admin123");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Basic ${base64Credentials}`,
    "Content-Type": "application/json",
  },
});

const orderApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("");
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get(`/${id}`);
    return data;
  },
  create: async (orderData: any) => {
    const { data } = await axiosInstance.post("/save", orderData);
    return data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/${id}`);
  },
  bulkDelete: async (ids: string[]) => {
    await axiosInstance.delete("/bulk-delete", { data: ids });
  },
};

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.lists(),
    queryFn: orderApi.getAll,
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
  });
};

export const useDeleteOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.bulkDelete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
  });
};
