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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BackHeader } from "../../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderItem {
  itemId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  supplierId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  createdDate: string;
  lastUpdatedDate: string;
  items: OrderItem[];
}

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderDetails, isLoading: detailsLoading } = useOrder(id || "");
  const { data: ordersList, isLoading: listLoading } = useOrders();

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const chartData = ordersList?.map((order) => ({
    date: new Date(order.orderDate).toLocaleDateString(),
    amount: order.totalAmount,
  }));

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
              {ordersList?.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/details/${order.id}`)}
                  className={cn(
                    "p-3 rounded-md cursor-pointer mb-2 hover:bg-muted/50 transition-colors",
                    order.id === id && "bg-muted"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Order #{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${order.totalAmount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="p-4 lg:p-6 bg-background overflow-y-auto">
        <BackHeader
          title="Order Details"
          subtitle="View order information and analytics"
          backTo="/admin/orders"
          className="mb-6"
        />

        {detailsLoading ? (
          <LoadingSkeleton />
        ) : orderDetails ? (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl lg:text-2xl">
                      Order #{orderDetails.id}
                    </CardTitle>
                    <CardDescription>
                      Supplier ID: {orderDetails.supplierId}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(orderDetails.status)}>
                    {orderDetails.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <OrderDetail order={orderDetails} />
                  <OrderItems items={orderDetails.items} />
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" />
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

export const OrderDetail = ({ order }: { order: Order }) => (
  <div className="space-y-3">
    <DetailRow
      label="Order Date"
      value={new Date(order.orderDate).toLocaleDateString()}
    />
    <DetailRow label="Total Amount" value={`$${order.totalAmount}`} />
    <DetailRow
      label="Created"
      value={new Date(order.createdDate).toLocaleDateString()}
    />
    <DetailRow
      label="Last Updated"
      value={new Date(order.lastUpdatedDate).toLocaleDateString()}
    />
  </div>
);

const OrderItems = ({ items }: { items: OrderItem[] }) => (
  <div className="space-y-3">
    <h3 className="font-medium">Order Items</h3>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="p-3 rounded-md border">
          <DetailRow label="Item ID" value={item.itemId} />
          <DetailRow label="Quantity" value={item.quantity} />
          <DetailRow label="Price" value={`$${item.price}`} />
        </div>
      ))}
    </div>
  </div>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="grid grid-cols-[120px_1fr] gap-2">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
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
