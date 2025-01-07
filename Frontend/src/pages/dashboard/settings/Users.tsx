import HeaderTitle from "@/components/commons/header-title";
import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCwIcon, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, useFetchAllUser } from "@/services/UserAPI"; // Assume we have a User API
import { PageHeader } from "../components/PageHeader";
import { toast } from "@/hooks/use-toast";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "user" | "supplier"; // You can define more roles if needed
  status: "active" | "inactive";
  image: string; // Assuming you have an image URL for the user
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "userDetails",
    header: "User Details",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <img
            src={user.image}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm">{user.contact}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-semibold">{user.username}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link
              to={`/admin/users/details/${user.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Users = () => {
  const { data: users, loading, error, refetch } = useFetchAllUser();
  const [viewMode, setViewMode] = useState("Table");
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      setLocalUsers(users);
    }
  }, [users]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast({
        title: "User Deleted",
        description: `User with ID: ${userId} has been deleted.`,
        variant: "destructive",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleViewMode = () => {
    setViewMode(viewMode === "Table" ? "Card" : "Table");
  };

  return (
    <div className="w-full">
      <HeaderTitle title="User Management" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-0">
          <PageHeader
            handleViewMode={handleViewMode}
            title="All Users"
            newButtonLink="/admin/users/add-user"
            actions={[
              {
                label: "Preferences",
                icon: <SettingsIcon className="h-4 w-4" />,
                link: "/admin/settings/preferences/users",
              },
              {
                label: "Refresh List",
                icon: <RefreshCwIcon className="h-4 w-4" />,
              },
            ]}
          />
        </section>
        <section className="p-6">
          {loading ? (
            <p>Loading...</p>
          ) : localUsers && localUsers.length > 0 ? (
            <GenericTable
              viewMode={viewMode}
              data={localUsers}
              columns={columns}
              context="users"
              onDeleteSelected={handleDeleteUser}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Card className="items-center flex flex-col gap-2 p-4">
                <CardTitle>Add New User</CardTitle>
                <CardDescription className="flex items-center flex-col gap-4">
                  <p>Create new users to manage.</p>

                  <Button asChild>
                    <Link to={"/admin/users/add-user"}>New User</Link>
                  </Button>
                </CardDescription>
              </Card>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Users;
