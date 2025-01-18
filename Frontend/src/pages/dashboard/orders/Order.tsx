import HeaderTitle from "@/components/commons/header-title";
import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { ColumnDef } from "@tanstack/react-table";
import { useDeleteOrders, useOrders } from "@/services/OrderAPI";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Order Id",
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
  },
  {
    accessorKey: "items",
    header: "Items Detail",
    cell: ({ row }) => {
      const items = row.getValue("items") as Array<{
        itemName: string;
        quantity: number;
      }>;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <div>
                <span className="font-medium">{items.length} items</span>
                <span className="text-gray-500 block text-sm">
                  Total Qty:{" "}
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <ul className="list-disc pl-4">
                {items.map((item, index) => (
                  <li key={index}>
                    {item.itemName} (Qty: {item.quantity})
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount");
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;
      const { toast } = useToast();
      // const cancelOrderMutation = useCancelOrder();

      // const handleCancelOrder = async () => {
      //   try {
      //     await cancelOrderMutation.mutateAsync(order.id);
      //     toast({
      //       title: "Success",
      //       description: "Order cancelled successfully",
      //     });
      //   } catch (error) {
      //     toast({
      //       title: "Error",
      //       description: "Failed to cancel order",
      //       variant: "destructive",
      //     });
      //   }
      // };

      const isPending = order.status === "PENDING";

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
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/admin/orders/${order.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admin/suppliers/profile/${order.supplierId}`}>
                View Supplier
              </Link>
            </DropdownMenuItem>
            {isPending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  // onClick={handleCancelOrder}
                  className="text-red-600"
                >
                  Cancel Order
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Order = () => {
  const { toast } = useToast();
  const { data: orders, isLoading, refetch } = useOrders();
  const deleteOrdersMutation = useDeleteOrders();
  const [viewMode, setViewMode] = useState("Table");

  const handleDeleteOrder = async (selectedIds: string[]) => {
    try {
      await deleteOrdersMutation.mutateAsync(selectedIds);
      toast({
        title: "Success",
        description: `${selectedIds.length} orders deleted`,
      });
      refetch(); // Refresh the data
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete orders",
        variant: "destructive",
      });
    }
  };
  console.log(orders);

  const handleViewMode = () => {
    setViewMode(viewMode === "Table" ? "Card" : "Table");
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Order" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-4">
          <header className="flex justify-between px-6">
            <h1 className="text-2xl font-medium">All Sales Orders</h1>
            <div className="inline-flex gap-4 items-center">
              <Button variant="link">
                <Info className="mr-2" />
                View Order Stats
              </Button>
              <Button asChild>
                <Link to="/admin/orders/add-order">
                  <PlusIcon className="mr-2" /> New
                </Link>
              </Button>
            </div>
          </header>
        </section>

        <section className="p-6 ">
          {isLoading ? (
            <p>Loading...</p>
          ) : orders?.data?.length ? (
            <GenericTable
              viewMode="Table"
              data={orders.data}
              columns={columns}
              context="orders"
              detailsPath="details"
              onDeleteSelected={handleDeleteOrder}
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
                  <Link to={"/admin/orders/add-order"}>Create Sales Order</Link>
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
