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
} from "lucide-react";
import {
  useOrders,
  usePendingOrders,
  useUpdateOrderStatus,
} from "@/services/OrderAPI";
import { GenericTable } from "@/components/GenericTable";

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
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Order ID",
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
    accessorKey: "supplierId",
    header: "Supplier ID",
    cell: ({ row }) => {
      const date = new Date(row.getValue("orderDate"));
      return date.toLocaleDateString();
    },
  },
  // {
  //   accessorKey: "items",
  //   header: "Items",
  //   cell: ({ row }) => {
  //     const items = row.getValue("items");
  //     return items.length;
  //   },
  // },
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
];

const pendingOrderColumns: ColumnDef[] = [
  ...orderColumns,
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      const updateOrderStatus = useUpdateOrderStatus();
      const { toast } = useToast();

      const handleStatusUpdate = async (status: string) => {
        try {
          await updateOrderStatus.mutateAsync({ orderId: order.id, status });
          toast({
            title: "Success",
            description: `Order ${status.toLowerCase()} successfully`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to ${status.toLowerCase()} order`,
            variant: "destructive",
          });
        }
      };

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-green-600 hover:text-green-700"
            onClick={() => handleStatusUpdate("ACCEPTED")}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleStatusUpdate("REJECTED")}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      );
    },
  },
  {
    id: "supplierName",
    header: "Supplier",
    accessorKey: "supplierName",
  },
];

const SupplierDashboard = () => {
  const { toast } = useToast();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: pendingOrdersResponse, isLoading: pendingLoading } =
    usePendingOrders();
  const [selectedTab, setSelectedTab] = useState("all");

  // Extract pending orders from the response
  const pendingOrders = pendingOrdersResponse || [];

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
          <Button asChild>
            <Link to="/admin/inventory">
              <Package className="w-4 h-4 mr-2" />
              Manage Inventory
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{orders?.data?.length || 0}</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">{pendingOrders?.length || 0}</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600">Requires Attention</p>
              <p className="text-2xl font-bold">
                {pendingOrders.map(
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
                    searchField="supplierId"
                  />
                )
              ) : pendingLoading ? (
                <div className="text-center py-8">
                  Loading pending orders...
                </div>
              ) : (
                <GenericTable
                  viewMode="Table"
                  data={pendingOrdersResponse || []}
                  columns={pendingOrderColumns}
                  context="pending-orders"
                  searchField="supplierName"
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
