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
import { useFetch } from "@/hooks/useFetch";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { LayoutGridIcon, List, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type InventoryItem = {
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
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View More</DropdownMenuItem>
            <DropdownMenuItem>View Suppliers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Inventory = () => {
  const { data: inventory, loading, error } = useFetch("inventory");
  const [viewMode, setViewMode] = useState("Table");

  const processedInventory = inventory?.map((item) => {
    let status: "good" | "low" | "critical" = "good";
    if (item.stock <= item.reorder) {
      status = item.stock === 0 ? "critical" : "low";
    }
    return { ...item, status };
  });

  return (
    <div className="w-full">
      <HeaderTitle />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-4">
          <header className="flex justify-between px-6">
            <h1 className="text-2xl font-medium">All Items</h1>
            <div className="inline-flex gap-4 items-center">
              <Button asChild>
                <Link
                  to="/inventory/add-item"
                  className="flex items-center gap-1"
                >
                  <PlusIcon /> New
                </Link>
              </Button>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("Card")}
                  className="rounded-s"
                >
                  <LayoutGridIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("Table")}
                  className="rounded-e"
                >
                  <List />
                </Button>
              </div>
            </div>
          </header>
        </section>
        <section className="p-6 ">
          {loading ? (
            <p>Loading...</p>
          ) : processedInventory && processedInventory.length > 0 ? (
            <GenericTable
              viewMode={viewMode}
              data={processedInventory}
              columns={columns}
            />
          ) : (
            <div className="grid grid-cols-3">
              <Card className="items-center flex flex-col gap-2 p-4">
                <CardTitle>Add new Stock</CardTitle>
                <CardDescription className="flex items-center flex-col gap-4">
                  <p>
                    Create standalone items and services that you buy and sell{" "}
                  </p>

                  <Button asChild>
                    <Link to={"/inventory/add-item"}>New Item</Link>
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
