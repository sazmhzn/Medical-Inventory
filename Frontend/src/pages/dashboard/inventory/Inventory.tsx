import HeaderTitle from "@/components/commons/header-title";
import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DownloadCloudIcon,
  EllipsisVertical,
  RefreshCwIcon,
  SettingsIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "../components/PageHeader";
import { toast } from "@/hooks/use-toast";
import {
  useDeleteInventoryItem,
  useInventory,
} from "@/services/__test_inventoryAPI";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { exportToExcel } from "@/lib/excel-utils";

export type InventoryItem = {
  id: string;
  status: "good" | "low" | "critical";
  name: string;
  stock: number;
  type: "good" | "service";
  price: number;
  reorder: number;
  unit: string;
};

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

const Inventory = () => {
  const {
    data: inventory,
    isLoading: loading,
    error,
    refetch,
  } = useInventory();

  const deleteMutation = useDeleteInventoryItem();

  const [viewMode, setViewMode] = useState<"Table" | "Card">("Table");
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    console.log(inventory);
    if (inventory) {
      const processedData = inventory.map((item: InventoryItem) => ({
        ...item,
        status:
          item.stock <= item.reorder
            ? item.stock === 0
              ? "critical"
              : "low"
            : "good",
      }));
      setLocalInventory(processedData);
      console.log(inventory);
      console.log(localInventory);
    }
  }, [inventory]);

  // Inventory-specific method
  const handleExportInventory = () => {
    if (!inventory) return;

    try {
      exportToExcel(inventory, "inentory-export");
      toast({
        title: "Export Successful",
        description: "Successfully exported inventory to Excel",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export inventory to Excel",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleImportSuccess = (importedData: InventoryItem[]) => {
    refetch();
  };

  const handleViewMode = () => {
    setViewMode(viewMode === "Table" ? "Card" : "Table");
  };

  const handleDeleteItems = async (selectedIds: string[]) => {
    try {
      // const result = await deleteInventoryItem(selectedIds);

      await Promise.all(
        selectedIds.map((id) =>
          deleteMutation.mutateAsync(id, {
            onSuccess: () => {
              toast({
                title: "Deleted",
                description: `Item deleted successfully`,
                variant: "destructive",
              });
            },
          })
        )
      );
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete items",
        variant: "destructive",
      });
      console.error("Failed to delete items:", error);
    }
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Inventory" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-0">
          <PageHeader
            handleViewMode={handleViewMode}
            title="All Inventory"
            newButtonLink="/admin/inventory/add-item"
            actions={[
              // {
              //   label: "Import Inventory",
              //   icon: <UploadCloudIcon className="h-4 w-4" />,
              //   onClick: handleImportSuccess,
              // },
              {
                label: "Export Inventory",
                icon: <DownloadCloudIcon className="h-4 w-4" />,
                onClick: handleExportInventory,
              },
              {
                label: "Preferences",
                icon: <SettingsIcon className="h-4 w-4" />,
                link: "/admin/settings/preferences/inventory",
              },
              {
                label: "Refresh List",
                icon: <RefreshCwIcon className="h-4 w-4" />,
                onClick: handleRefresh,
              },
            ]}
          />
        </section>
        <section className="p-6 ">
          {loading ? (
            viewMode === "Table" ? (
              <InventoryTableSkeleton />
            ) : (
              <InventoryCardSkeleton />
            )
          ) : localInventory && localInventory.length > 0 ? (
            <GenericTable
              viewMode={viewMode}
              data={localInventory}
              columns={columns}
              context="inventory"
              onDeleteSelected={handleDeleteItems}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="items-center flex flex-col gap-4 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-24 h-24">
                  {/* Replace with the actual image path */}
                  <img
                    src="/assets/images/add-item.svg"
                    alt="Add New Item"
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardTitle className="text-xl font-semibold">
                  Add New Stock
                </CardTitle>
                <CardDescription className="flex items-center flex-col gap-4 text-center text-sm text-muted-foreground">
                  <p>
                    Create standalone items and services that you buy and sell.
                  </p>

                  <Button asChild>
                    <Link to={"/admin/inventory/add-item"}>New Item</Link>
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

export default Inventory;

export const InventoryTableSkeleton = () => {
  // Generate 5 skeleton rows by default
  const skeletonRows = Array.from({ length: 2 }, (_, index) => index);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-[60px]" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[60px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Card view skeleton for when the view mode is set to "Card"
export const InventoryCardSkeleton = () => {
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletonCards.map((index) => (
        <div
          key={index}
          className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
        >
          <div className="flex items-start justify-between space-y-4">
            <div className="space-y-4 w-full">
              <Skeleton className="h-4 w-[150px]" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
