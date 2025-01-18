import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOrder, useOrders } from "@/services/OrderAPI";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Order, OrderItem } from "types/types";
import {
  Edit,
  Package,
  Calendar,
  DollarSign,
  Clock,
  Building,
  Phone,
  User,
  ChartArea,
} from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NRS",
  }).format(amount);
};

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderDetails, isLoading: detailsLoading } = useOrder(id || "");
  const { data: ordersList, isLoading: listLoading, refetch } = useOrders();

  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null;

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      SHIPPED: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-emerald-100 text-emerald-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const chartData = ordersList?.data?.map((order) => ({
    date: new Date(order.orderDate).toLocaleDateString(),
    amount: order.totalAmount,
  }));

  console.log(orderDetails);
  console.log(ordersList);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] h-full">
      {/* Sidebar */}
      <aside className="bg-background border-r lg:block hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Orders History</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {listLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="p-2">
              {ordersList?.data?.map((order) => (
                <div
                  key={order.id}
                  onClick={() =>
                    navigate(
                      `/${role === "ROLE_ADMIN" ? "admin" : "supplier"}/orders/details/${order.id}`
                    )
                  }
                  className={cn(
                    "p-3 rounded-md cursor-pointer mb-2 hover:bg-muted/50 transition-colors",
                    order.id === Number(id) && "bg-muted"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Order #{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(order.totalAmount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="p-4 lg:p-6 bg-background overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <BackHeader
            title="Order Details"
            subtitle="View order information and analytics"
            backTo={`/${role === "ROLE_ADMIN" ? "admin/orders" : "supplier"}`}
          />

          {role === "ROLE_ADMIN" &&
            orderDetails &&
            orderDetails.status !== "DELIVERED" &&
            orderDetails.status !== "REJECTED" && (
              <Button
                onClick={() => navigate(`/admin/orders/${id}/edit`)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Order
              </Button>
            )}
        </div>

        {detailsLoading ? (
          <LoadingSkeleton />
        ) : orderDetails ? (
          <div className="space-y-6">
            {/* Status and Summary Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Order #{orderDetails.data.id}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Placed on:{" "}
                      {new Date(
                        orderDetails.data.orderDate
                      ).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(orderDetails.status)}>
                      {orderDetails.data.status}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(orderDetails.data.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Order Items */}
              <CardContent>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.data.items.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-medium">{item.itemName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} ×{" "}
                              {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer and Supplier Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow
                    icon={<User className="w-4 h-4" />}
                    label="Name"
                    value={orderDetails.data.customerName}
                  />
                  <DetailRow
                    icon={<Building className="w-4 h-4" />}
                    label="Organization"
                    value={orderDetails.data.customerOrganization}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Supplier Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow
                    icon={<User className="w-4 h-4" />}
                    label="Name"
                    value={orderDetails.data.supplierName}
                  />
                  <DetailRow
                    icon={<Building className="w-4 h-4" />}
                    label="Organization"
                    value={orderDetails.data.supplierOrganization}
                  />
                  <DetailRow
                    icon={<Phone className="w-4 h-4" />}
                    label="Contact"
                    value={orderDetails.data.supplierContact}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DetailRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="Created Date"
                    value={new Date(
                      orderDetails.data.createdDate
                    ).toLocaleString()}
                  />
                  <DetailRow
                    icon={<Clock className="w-4 h-4" />}
                    label="Last Updated"
                    value={new Date(
                      orderDetails.data.lastUpdatedDate
                    ).toLocaleString()}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartArea className="w-5 h-5" />
                  Order Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">No order details found.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-3">
    {icon}
    <div className="flex gap-2">
      <span className="font-medium">{label}:</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default OrderDetails;
