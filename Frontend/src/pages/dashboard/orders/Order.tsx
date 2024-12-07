import HeaderTitle from "@/components/commons/header-title";
import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { Info, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

const columns: ColumnDef[] = [
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
  },
  {
    accessorKey: "orderId",
    header: "Order Id",
  },
  {
    accessorKey: "supplierId",
    header: "supplierId",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "items",
    header: "Item Quantity",
    cell: ({ row }) => {
      const items = row.getValue("items");
      return items.reduce((acc, item) => acc + item.quantity, 0);
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
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

const Order = () => {
  const { data: inventory, loading, error } = useFetch("orders");
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
            <h1 className="text-2xl font-medium">All Sales Orders</h1>
            <div className="inline-flex gap-4 items-center">
              <div>
                <Button variant="link">
                  <Info />
                  View Order Stats
                </Button>
              </div>
              <Button asChild>
                <Link
                  to="/orders/add-order"
                  className="flex items-center gap-1"
                >
                  <PlusIcon /> New
                </Link>
              </Button>
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
            <section className="p-6 ">
              <div className="flex flex-col gap-6 items-center justify-center  min-h-[50vh]">
                <div className="text-center">
                  <h2 className="text-3xl font font-medium">
                    Start Managing your sales activities
                  </h2>
                  <p className="text-neutral-400">
                    Create, Customize and send professional Sales Orders.
                  </p>
                </div>

                <Button className="uppercase" asChild>
                  <Link to={"/orders/add-order"}>Create Sales Order</Link>
                </Button>
              </div>
            </section>
          )}
        </section>
      </div>
    </div>
  );
};

export default Order;
