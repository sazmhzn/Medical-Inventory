import HeaderTitle from "@/components/commons/header-title";
import { Button } from "@/components/ui/button";
import {
  DownloadCloudIcon,
  RefreshCwIcon,
  SettingsIcon,
  UploadCloudIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { GenericTable } from "@/components/GenericTable";
import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "types/types";
import { useSuppliers } from "@/services/SupplierAPI";
import { useToast } from "@/hooks/use-toast";
const columns: ColumnDef<Supplier>[] = [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },

  {
    accessorKey: "emailAddress",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("emailAddress")}</div>,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => <div>{row.getValue("contact")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("createdDate")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "lastUpdatedDate",
    header: "Last Updated",
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("lastUpdatedDate")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "customValue",
    header: "Custom Value",
    cell: ({ row }) => <div>{row.getValue("customValue") || "N/A"}</div>,
  },
];

const Suppliers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: suppliers, isLoading, refetch } = useSuppliers(); // Using React Query hook

  const [viewMode, setViewMode] = useState("Table");

  // const selectedSupplier = suppliers.find((s) => s.id.toString() === value);

  const handleImport = () => {
    console.log("Import Suppliers clicked");
  };

  const handleExport = () => {
    if (!suppliers || suppliers.length === 0) {
      toast({
        title: "Export Failed",
        description: "No suppliers data available to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "ID",
      "Username",
      "Name",
      "Email",
      "Contact",
      "Address",
      "Created Date",
      "Last Updated",
      "Custom Value",
    ];

    const csvData = suppliers.map((supplier) => [
      supplier.id,
      supplier.username,
      supplier.name,
      supplier.emailAddress,
      supplier.contact,
      supplier.address,
      new Date(supplier.createdDate).toLocaleDateString(),
      new Date(supplier.lastUpdatedDate).toLocaleDateString(),
      supplier.customValue || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `suppliers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: "Suppliers list has been exported to CSV",
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleViewMode = () => {
    setViewMode(viewMode === "Table" ? "Card" : "Table");
  };

  const handleDeleteItems = async (selectedIds: string[]) => {
    try {
      // const result = await delete(selectedIds);
      refetch();
      toast({
        title: "Items Deleted",
        description: `Successfully deleted ${selectedIds.length} suppliers`,
        variant: "success",
      });
      console.log("Deleting the item: ", selectedIds);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete selected suppliers",
        variant: "destructive",
      });
      console.error("Failed to delete items:", error);
    }
  };

  const handleAddSupplier = () => {
    navigate("/admin/suppliers");
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Dashboard" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <PageHeader
          handleViewMode={handleViewMode}
          title="All Inventory"
          newButtonLink="/admin/suppliers/add-suppliers"
          actions={[
            {
              label: "Import Suppliers",
              icon: <UploadCloudIcon className="h-4 w-4" />,
              // onClick: handleImport,
            },
            {
              label: "Export Suppliers",
              icon: <DownloadCloudIcon className="h-4 w-4" />,
              onClick: handleExport,
            },
            {
              label: "Preferences",
              icon: <SettingsIcon className="h-4 w-4" />,
              link: "/admin/settings/preferences/inventory",
            },
            {
              label: "Refresh List",
              icon: <RefreshCwIcon className="h-4 w-4" />,
              onClick: handleRefresh,
            },
          ]}
        />
        <section className="p-6 ">
          {isLoading ? (
            <p>Loading...</p>
          ) : suppliers && suppliers.length > 0 ? (
            <GenericTable
              viewMode={viewMode}
              data={suppliers}
              columns={columns}
              onDeleteSelected={handleDeleteItems}
              context="suppliers"
              detailsPath="profile"
            />
          ) : (
            <div className="flex flex-col gap-6 items-center justify-center  min-h-[50vh]">
              <div className="text-center">
                <h2 className="text-3xl font font-medium">
                  Business is no fun without people.
                </h2>
                <p className="text-neutral-400">
                  Create and manage your contacts, all in one place.
                </p>
              </div>

              <Button className="uppercase" asChild>
                <Link to={"/admin/suppliers/add-suppliers"}>
                  Create New Vendor
                </Link>
              </Button>

              <Link to="/admin/suppliers/add-supplier">
                Click here to import vendors from file
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Suppliers;
