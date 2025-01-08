// src/api/users.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "./api-client";
import { UserDetails } from "types/types";

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
