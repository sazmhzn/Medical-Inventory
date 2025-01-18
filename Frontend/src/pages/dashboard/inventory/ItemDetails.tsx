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
import { BackHeader, PageHeader } from "../components/PageHeader";
import { cn } from "@/lib/utils";
import InventoryStockChart from "./components/InventoryStockChart";
import {
  AlertTriangle,
  BarChart2,
  Edit,
  Package,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: itemDetails, loading, error } = useFetchInventoryById(id);
  const {
    data: inventoryList,
    loading: listLoading,
    error: listError,
  } = useFetchInventory("item");

  console.log(inventoryList);

  const handleItemClick = (itemId: string) => {
    navigate(`/admin/inventory/item/${itemId}`);
  };

  const getStockStatus = () => {
    if (itemDetails.stock === 0) return { color: "red", text: "Out of Stock" };
    if (itemDetails.stock <= itemDetails.reorder)
      return { color: "yellow", text: "Low Stock" };
    return { color: "green", text: "In Stock" };
  };

  // const customFields = Object.entries(
  //   JSON.parse(itemDetails.customValue || "{}")
  // );

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
      <main className="p-0 bg-background">
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
          <div className="p-4 border border-red-200 rounded-md">
            <p className="text-red-800">Error loading item details</p>
          </div>
        ) : itemDetails ? (
          <>
            <PageHeader
              title="Item Details"
              backButtonLink="/admin/inventory"
            />

            <Card className="p-0 rounded-none shadow-none border-none">
              <CardHeader>
                <div className="p-0 m-0">
                  <div className=" max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="w-100  flex justify-between items-start mb-8">
                      <div>
                        <h1 className="text-3xl font-bold">
                          {itemDetails.name}
                        </h1>
                        <p className="text-muted-foreground">
                          {itemDetails.sku}
                        </p>
                      </div>
                      <Button>
                        <Link
                          to={`/admin/inventory/edit/${id}`}
                          className="flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit Item
                        </Link>{" "}
                      </Button>
                    </div>
                  </div>
                  {itemDetails.image && (
                    <div className="mb-2">
                      <img
                        src={`data:image/jpeg;base64,${itemDetails.image}`}
                        alt={`${itemDetails.name} image`}
                        className="w-64 h-64 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <CardTitle className="text-2xl">{itemDetails.name}</CardTitle>
                  <CardDescription>
                    {itemDetails.description || "No description available"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  <Card className=" w-100 p-0">
                    <CardContent className="pt-6">
                      <div className="flex gap-4 items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Current Stock
                          </p>
                          <h3 className="text-2xl font-bold mt-1">
                            {itemDetails.stock}
                          </h3>
                        </div>
                        <Package className="w-8 h-8 text-blue-500" />
                      </div>
                      <Badge
                        className={`shadow-none mt-2 ${
                          getStockStatus().color === "green"
                            ? "bg-green-100 text-green-800"
                            : getStockStatus().color === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStockStatus().text}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Price
                          </p>
                          <h3 className="text-2xl font-bold mt-1">
                            ${itemDetails.price}
                          </h3>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Category
                          </p>
                          <h3 className="text-xl font-bold mt-1 capitalize">
                            {itemDetails.category}
                          </h3>
                        </div>
                        <BarChart2 className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Reorder Level
                          </p>
                          <h3 className="text-2xl font-bold mt-1">
                            {itemDetails.reorder}
                          </h3>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Details Grid */}

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">SKU</p>
                          <p className="font-medium">{itemDetails.sku}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Unit</p>
                          <p className="font-medium">{itemDetails.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">
                            {itemDetails.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Batch Number
                          </p>
                          <p className="font-medium">
                            {itemDetails.batchNumber}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Manufacturer
                          </p>
                          <p className="font-medium">
                            {itemDetails.manufacturer || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className=" text-sm text-muted-foreground">
                            Storage Conditions
                          </p>
                          <p className="font-medium">
                            {itemDetails.storageConditions || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Expiry Date
                          </p>
                          <p className="font-medium">
                            {new Date(
                              itemDetails.expiryDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Last Updated
                          </p>
                          <p className="font-medium">
                            {new Date(
                              itemDetails.lastUpdatedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <InventoryStockChart itemDetails={itemDetails} />
              </CardContent>
            </Card>

            {/* Custom Fields Section */}
            {/* {customFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Custom Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {customFields.map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground">key</p>
                        <p className="font-medium">valeis</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
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
