import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSupplier, useSuppliers } from "@/services/SupplierAPI";
import { Avatar } from "@radix-ui/react-avatar";
import { User, Badge, Mail, Phone, MapPin, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: supplierDetails, isLoading: loading } = useSupplier(id);
  const { data: supplierList, isLoading: listLoading } = useSuppliers();

  const handleSupplierClick = (supplierId: string) => {
    navigate(`/admin/suppliers/profile/${supplierId}`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  return (
    <div className="grid md:grid-cols-[280px_1fr] h-full">
      <aside className="bg-background border-r md:inline hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Suppliers</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/suppliers">View All</Link>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {listLoading ? (
            <div className="p-4 space-y-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
          ) : (
            <div className="p-2">
              {supplierList?.map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() => handleSupplierClick(supplier.id.toString())}
                  className={cn(
                    "p-3 rounded-md cursor-pointer mb-2 hover:bg-muted/50 transition-colors",
                    supplier.id.toString() === id && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <User className="h-4 w-4" />
                    </Avatar>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {supplier.contact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      <main className="p-6 bg-background">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <Card>
              <CardContent className="grid gap-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
              </CardContent>
            </Card>
          </div>
        ) : supplierDetails ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  {supplierDetails.name}
                </h1>
                <Badge>{supplierDetails.role}</Badge>
              </div>
              <div className="space-x-2">
                <Button variant="outline" asChild>
                  <Link to={`/admin/suppliers/edit/${id}`}>Edit</Link>
                </Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Username:</span>
                    <span>{supplierDetails.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{supplierDetails.emailAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Contact:</span>
                    <span>{supplierDetails.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Address:</span>
                    <span>{supplierDetails.address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(supplierDetails.createdDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Last Updated:</span>
                    <span>
                      {formatDate(supplierDetails.lastUpdatedDate)}
                    </span>{" "}
                    date
                  </div>
                </CardContent>
              </Card>

              {supplierDetails?.customFormData && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Custom Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {JSON.parse(
                      supplierDetails.customFormData.formConfig
                    ).fields.map((field: any) => (
                      <div key={field.name} className="mb-4">
                        <span className="font-medium">{field.label}:</span>
                        <span className="ml-2">
                          {supplierDetails.customValue?.[field.name] || "N/A"}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No supplier details found.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
