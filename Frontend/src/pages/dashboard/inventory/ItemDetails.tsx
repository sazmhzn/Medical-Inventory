import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useFetchInventoryById,
  useFetchInventory,
} from "@/services/InventoryAPI";
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
import { BackHeader } from "../components/PageHeader";
import { cn } from "@/lib/utils";
import InventoryStockChart from "./components/InventoryStockChart";

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: itemDetails, loading, error } = useFetchInventoryById(id);
  const {
    data: inventoryList,
    loading: listLoading,
    error: listError,
  } = useFetchInventory("item");

  const handleItemClick = (itemId: string) => {
    navigate(`/admin/inventory/item/${itemId}`);
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] h-full">
      {/* Sidebar */}
      <aside className="bg-background border-r md:inline hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Inventory Items</h2>
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
              <p className="text-red-500">Error loading items</p>
            </div>
          ) : (
            <div className="p-2">
              {inventoryList?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "p-3 rounded-md cursor-pointer mb-1 hover:bg-muted/50 transition-colors",
                    item.id === id && "bg-muted"
                  )}
                >
                  <div className="font-medium mb-1">{item.name}</div>
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Stock: {item.stock}</span>
                    <span>${item.price}</span>
                  </div>
                  {item.stock <= item.reorder && (
                    <div
                      className={cn(
                        "text-xs mt-1 px-2 py-0.5 rounded-full w-fit",
                        item.stock === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {item.stock === 0 ? "Out of stock" : "Low stock"}
                    </div>
                  )}
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
            <p className="text-red-800">Error loading item details</p>
          </div>
        ) : itemDetails ? (
          <>
            <BackHeader
              title="Item Details"
              subtitle="View and edit item information"
              backTo="/admin/inventory"
              className="mb-6"
            />
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {itemDetails.name}
                    </CardTitle>
                    <CardDescription>
                      {itemDetails.description || "No description available"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to={`/admin/inventory/edit/${id}`}>Edit Item</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">SKU:</span>
                      <span>{itemDetails.sku}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Unit:</span>
                      <span>{itemDetails.unit}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{itemDetails.type}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Stock:</span>
                      <span>{itemDetails.stock} units</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Price:</span>
                      <span>${itemDetails.price}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Reorder Level:</span>
                      <span>{itemDetails.reorder}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Expiry Date:</span>
                      <span>{itemDetails.expiryDate}</span>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Manufacturer:</span>
                      <span>{itemDetails.manufacturer}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Batch Number:</span>
                      <span>{itemDetails.batchNumber}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Category:</span>
                      <span>{itemDetails.category}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Storage:</span>
                      <span>
                        {itemDetails.storageConditions || "Not specified"}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Created:</span>
                      <span>
                        {new Date(itemDetails.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-medium">Last Updated:</span>
                      <span>
                        {new Date(
                          itemDetails.lastUpdatedDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {itemDetails.image && (
                  <div className="mt-8">
                    <h3 className="font-medium mb-3">Product Image</h3>
                    <img
                      src={`data:image/jpeg;base64,${itemDetails.image}`}
                      alt={`${itemDetails.name} image`}
                      className="w-64 h-64 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <InventoryStockChart itemDetails={itemDetails} />
          </>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">No item details found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
