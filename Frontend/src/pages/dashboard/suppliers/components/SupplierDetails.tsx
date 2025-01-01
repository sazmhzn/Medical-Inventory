import { useParams, useNavigate, Link } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import {
  useFetchSuppliers,
  useFetchUserById,
  UserDetails,
} from "@/services/UserAPI";
import { useEffect, useState } from "react";

export function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplierDetails, setSupplierDetails] = useState<UserDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: supplierList,
    loading: listLoading,
    error: listError,
  } = useFetchSuppliers();

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/mis/user/${id}`, {
          headers: {
            Authorization: `Basic ${btoa("admin:admin123")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch supplier details");
        }

        const data = await response.json();
        setSupplierDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierDetails();
  }, [id]);

  const handleSupplierClick = (supplierId: string) => {
    navigate(`/admin/suppliers/profile/${supplierId}`);
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] h-full">
      {/* Sidebar */}
      <aside className="bg-background border-r md:inline hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Suppliers</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {listLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : listError ? (
            <div className="p-4">
              <p className="text-red-500">Error loading suppliers</p>
            </div>
          ) : (
            <div className="p-2">
              {supplierList?.map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() => handleSupplierClick(supplier.id.toString())}
                  className={cn(
                    "p-3 rounded-md cursor-pointer mb-1 hover:bg-muted/50 transition-colors",
                    supplier.id.toString() === id && "bg-muted"
                  )}
                >
                  <div className="font-medium mb-1">{supplier.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {supplier.contact}
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
            <p className="text-red-800">
              Error loading supplier details: {error}
            </p>
          </div>
        ) : supplierDetails ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">{supplierDetails.name}</h1>
              <Button variant="outline" asChild>
                <Link to={`/admin/suppliers/edit/${id}`}>Edit Supplier</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="font-medium">Contact:</span>
                    <span>{supplierDetails.contact || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Address:</span>
                    <span>{supplierDetails.address || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Roles:</span>
                    <span>{supplierDetails.roles.join(", ")}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-4">Additional Details</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="font-medium">Created Date:</span>
                    <span>{supplierDetails.createdDate}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Last Updated:</span>
                    <span>{supplierDetails.lastUpdatedDate}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">No supplier details found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
