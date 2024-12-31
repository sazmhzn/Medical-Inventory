import HeaderTitle from "@/components/commons/header-title";
import { Button } from "@/components/ui/button";
import {
  DownloadCloudIcon,
  EllipsisVertical,
  RefreshCwIcon,
  SettingsIcon,
  UploadCloudIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { GenericTable } from "@/components/GenericTable";
import { useEffect, useState } from "react";
import { useFetchAllUser } from "@/services/UserAPI";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "../inventory/Inventory";

const columns: ColumnDef<InventoryItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-between p-0 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "image",
    header: "Img",
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-between p-0 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "reorder",
    header: "Reorder",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "batchNumber",
    header: "Batch No.",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "storageConditions",
    header: "Storage Conditions",
  },
  {
    accessorKey: "description",
    header: "Desc.",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Stock ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              to={`/admin/inventory/item/${payment.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <EllipsisVertical className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Suppliers = () => {
  const { data: users, loading, error, refetch } = useFetchAllUser("inventory");
  const [viewMode, setViewMode] = useState("Table");

  // Filter suppliers from all users
  const suppliers =
    users?.filter(
      (user) =>
        user.roles.includes("SUPPLIER") || user.roles.includes("ROLE_SUPPLIER")
    ) || [];

  // const selectedSupplier = suppliers.find((s) => s.id.toString() === value);

  const handleImport = () => {
    console.log("Import Suppliers clicked");
  };

  const handleExport = () => {
    console.log("Export Suppliers clicked");
  };

  const handleRefresh = () => {
    console.log("Refresh List clicked");
  };

  const handleDeleteItems = async (selectedIds: string[]) => {
    try {
      // const result = await delete(selectedIds);
      refetch();
      console.log("Deleting the item: ", selectedIds);
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Dashboard" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <PageHeader
          title="All Suppliers"
          newButtonLink="/admin/suppliers/add-suppliers"
          actions={[
            {
              label: "Import Suppliers",
              icon: <UploadCloudIcon className="h-4 w-4" />,
              onClick: handleImport,
            },
            {
              label: "Export Suppliers",
              icon: <DownloadCloudIcon className="h-4 w-4" />,
              onClick: handleExport,
            },
            {
              label: "Preferences",
              icon: <SettingsIcon className="h-4 w-4" />,
              link: "/admin/suppliers/preference",
            },
            {
              label: "Refresh List",
              icon: <RefreshCwIcon className="h-4 w-4" />,
              onClick: handleRefresh,
            },
          ]}
        />
        <section className="p-6 ">
          <section className="p-6 ">
            {loading ? (
              <p>Loading...</p>
            ) : suppliers && suppliers.length > 0 ? (
              <GenericTable
                viewMode={viewMode}
                data={suppliers}
                columns={columns}
                onDeleteSelected={handleDeleteItems}
                context="customers"
                detailsPath="profile"
              />
            ) : (
              <div className="flex flex-col gap-6 items-center justify-center  min-h-[50vh]">
                <div className="text-center">
                  <h2 className="text-3xl font font-medium">
                    Business is no fun without people.
                  </h2>
                  <p className="text-neutral-400">
                    Create and manage your contacts, all in one place.
                  </p>
                </div>

                <Button className="uppercase" asChild>
                  <Link to={"/admin/suppliers/add-suppliers"}>
                    Create New Vendor
                  </Link>
                </Button>

                <Link to="/admin/suppliers/add-supplier">
                  Click here to import vendors from file
                </Link>
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default Suppliers;
