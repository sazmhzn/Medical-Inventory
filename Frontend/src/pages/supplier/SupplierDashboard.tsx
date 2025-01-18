// import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  useOrders,
  usePendingOrders,
  useUpdateOrderStatus,
} from "@/services/OrderAPI";
import { GenericTable } from "@/components/GenericTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const orderColumns: ColumnDef[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="flex items-center gap-2">
          {status === "PENDING" && (
            <Clock className="w-4 h-4 text-yellow-500" />
          )}
          {status === "ACCEPTED" && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {status === "REJECTED" && (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          {status === "SHIPPED" && (
            <Package className="w-4 h-4 text-blue-500" />
          )}
          {status === "DELIVERED" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span
            className={`
            ${status === "PENDING" ? "text-yellow-700" : ""}
            ${status === "ACCEPTED" ? "text-green-700" : ""}
            ${status === "REJECTED" ? "text-red-700" : ""}
            ${status === "SHIPPED" ? "text-blue-700" : ""}
            ${status === "DELIVERED" ? "text-emerald-700" : ""}
          `}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Order ID",
  },

  {
    accessorKey: "customerName",
    header: "Customer",
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
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount");
      const formattedAmount = new Intl.NumberFormat("ne-NP", {
        style: "currency",
        currency: "NPR",
      }).format(amount);
      return formattedAmount;
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("orderDate"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      const updateOrderStatus = useUpdateOrderStatus();
      const { toast } = useToast();
      const [isUpdating, setIsUpdating] = useState(false);

      const handleStatusUpdate = async (status: string) => {
        setIsUpdating(true);
        try {
          await updateOrderStatus.mutateAsync({
            orderId: order.id,
            status,
            updateInventory: status === "DELIVERED",
          });
          toast({
            title: "Order Updated Successfully",
            description: `Order #${order.id} has been ${status.toLowerCase()}`,
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Update Failed",
            description:
              "Please try again or contact support if the issue persists",
            variant: "destructive",
          });
        } finally {
          setIsUpdating(false);
        }
      };

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

            {/* Status Update Options */}
            {order.status === "PENDING" && (
              <>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("ACCEPTED")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  Accept Order
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate("REJECTED")}
                >
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Reject Order
                </DropdownMenuItem>
              </>
            )}

            {order.status === "ACCEPTED" && (
              <DropdownMenuItem onClick={() => handleStatusUpdate("SHIPPED")}>
                <Package className="w-4 h-4 mr-2 text-blue-500" />
                Mark as Shipped
              </DropdownMenuItem>
            )}

            {order.status === "SHIPPED" && (
              <DropdownMenuItem onClick={() => handleStatusUpdate("DELIVERED")}>
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                Mark as Delivered
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Order Management Options */}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy Order ID
            </DropdownMenuItem>

            <Link
              to={`/admin/orders/${order.id}`}
              className="inline-flex items-center justify-between w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              View Details
            </Link>

            {order.status !== "DELIVERED" && order.status !== "REJECTED" && (
              <Link
                to={`/admin/orders/${order.id}/edit`}
                className="inline-flex items-center justify-between w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Edit Order
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const pendingOrderColumns: ColumnDef[] = [...orderColumns];

const SupplierDashboard = () => {
  const { toast } = useToast();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: pendingOrders, isLoading: pendingLoading } = usePendingOrders();
  const [selectedTab, setSelectedTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Supplier Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your orders and inventory
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Package className="w-4 h-4" />
            )}
            Refresh Data
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-none hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{orders?.data?.length || 0}</p>
            </div>
          </Card>

          <Card className="p-6 shadow-none hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">
                {pendingOrders?.data?.length || 0}
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-none hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600">Requires Attention</p>
              <p className="text-2xl font-bold">
                {pendingOrders?.data?.map(
                  (order) =>
                    order.status === "PENDING" &&
                    new Date(order.orderDate) <
                      new Date(Date.now() - 24 * 60 * 60 * 1000)
                ).length || 0}
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex gap-4 px-6 py-4">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedTab === "all"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedTab("all")}
                >
                  All Orders
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedTab === "pending"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedTab("pending")}
                >
                  Pending Orders
                </button>
              </nav>
            </div>

            <div className="p-6">
              {selectedTab === "all" ? (
                ordersLoading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : (
                  <GenericTable
                    viewMode="Table"
                    data={orders.data || []}
                    columns={orderColumns}
                    context="orders"
                    detailsPath="details"
                    role="supplier"
                    searchField="customerName"
                  />
                )
              ) : pendingLoading ? (
                <div className="text-center py-8">
                  Loading pending orders...
                </div>
              ) : (
                <GenericTable
                  viewMode="Table"
                  data={pendingOrders?.data || []}
                  columns={pendingOrderColumns}
                  context="profile"
                  role="supplier"
                  detailsPath="pending-orders"
                  searchField="customerName"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
