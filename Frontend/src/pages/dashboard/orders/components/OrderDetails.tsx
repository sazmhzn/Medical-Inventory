import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BackHeader } from "../../components/PageHeader";
import { useFetchOrder, useFetchOrderById } from "@/services/OrderAPI";

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderDetails, loading, error } = useFetchOrderById(id);
  const {
    data: ordersList,
    loading: listLoading,
    error: listError,
  } = useFetchOrder();

  const handleOrderClick = (orderId: string) => {
    navigate(`/admin/orders/details/${orderId}`);
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] h-full">
      {/* Sidebar */}
      <aside className="bg-background border-r md:inline hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Orders</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {listLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : listError ? (
            <div className="p-4">
              <p className="text-red-500">Error loading orders</p>
            </div>
          ) : (
            <div className="p-2">
              {ordersList?.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className={cn(
                    "p-3 rounded-md cursor-pointer mb-1 hover:bg-muted/50 transition-colors",
                    order.id === id && "bg-muted"
                  )}
                >
                  <div className="font-medium mb-1">Order #{order.id}</div>
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Status: {order.status}</span>
                    <span>${order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Details Section */}
      <main className="p-6 bg-background">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {[...Array(7)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[...Array(7)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error loading order details</p>
          </div>
        ) : orderDetails ? (
          <>
            <BackHeader
              title="Order Details"
              subtitle="View and edit order information"
              backTo="/admin/orders"
              className="mb-6"
            />
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      Order #{orderDetails.id}
                    </CardTitle>
                    <CardDescription>
                      Supplier ID: {orderDetails.supplierId}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Order Date:</span>
                      <span>{orderDetails.orderDate}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Status:</span>
                      <span>{orderDetails.status}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Total Amount:</span>
                      <span>${orderDetails.totalAmount}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Created:</span>
                      <span>
                        {new Date(
                          orderDetails.createdDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Last Updated:</span>
                      <span>
                        {new Date(
                          orderDetails.lastUpdatedDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-3">
                    <div className="font-medium mb-3">Items</div>
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="p-3 rounded-md border mb-2">
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <span className="font-medium">Item ID:</span>
                          <span>{item.itemId}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <span className="font-medium">Quantity:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                          <span className="font-medium">Price:</span>
                          <span>${item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">No order details found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
