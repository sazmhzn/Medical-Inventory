import HeaderTitle from "@/components/commons/header-title";
import { GenericTable } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DownloadCloudIcon,
  EllipsisVertical,
  LayoutGridIcon,
  List,
  PlusIcon,
  RefreshCwIcon,
  SettingsIcon,
  Upload,
  UploadCloudIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteInventoryItem,
  useFetchInventory,
} from "@/services/InventoryAPI";
import { PageHeader } from "../components/PageHeader";
import EditItem from "./components/EditItem";
import { toast } from "@/hooks/use-toast";

export type InventoryItem = {
  id: string;
  status: "good" | "low" | "critical";
  name: string;
  stock: number;
  type: "good" | "service";
  price: number;
  reorder: number;
  unit: string;
};

const columns: ColumnDef<InventoryItem>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-between p-0 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "image",
    header: "Img",
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="justify-between p-0 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "reorder",
    header: "Reorder",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "batchNumber",
    header: "Batch No.",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "storageConditions",
    header: "Storage Conditions",
  },
  {
    accessorKey: "description",
    header: "Desc.",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Stock ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              to={`/admin/inventory/item/${payment.id}`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <EllipsisVertical className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const CSVImportDialog = ({
  onImportSuccess,
}: {
  onImportSuccess: (data: InventoryItem[]) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid CSV file");
      setFile(null);
    }
  };

  const processCSVData = (csvText: string) => {
    try {
      const lines = csvText.split("\n");
      const headers = lines[0].split(",").map((header) => header.trim());

      const inventoryItems: InventoryItem[] = lines
        .slice(1)
        .filter((line) => line.trim())
        .map((line) => {
          const values = line.split(",").map((value) => value.trim());
          const item: any = {};

          headers.forEach((header, index) => {
            if (
              header === "stock" ||
              header === "price" ||
              header === "reorder"
            ) {
              item[header] = parseFloat(values[index]) || 0;
            } else {
              item[header] = values[index];
            }
          });

          // Add default values for required fields if missing
          item.status =
            item.stock <= item.reorder
              ? item.stock === 0
                ? "critical"
                : "low"
              : "good";
          item.type = item.type || "good";
          item.id = item.id || crypto.randomUUID();

          return item as InventoryItem;
        });

      return inventoryItems;
    } catch (error) {
      throw new Error("Failed to process CSV file. Please check the format.");
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const inventoryItems = processCSVData(text);
      onImportSuccess(inventoryItems);
      setFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Inventory from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>The CSV file should contain the following columns:</p>
            <ul className="list-disc list-inside mt-2">
              <li>name (required)</li>
              <li>stock (required, number)</li>
              <li>price (required, number)</li>
              <li>reorder (required, number)</li>
              <li>unit</li>
              <li>type</li>
              <li>manufacturer</li>
              <li>category</li>
              <li>description</li>
            </ul>
          </div>
          <Button onClick={handleImport} disabled={!file}>
            Import Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Inventory = () => {
  const {
    data: inventory,
    loading,
    error,
    refetch,
  } = useFetchInventory("inventory");
  const [viewMode, setViewMode] = useState("Table");
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>([]);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null>(null);

  useEffect(() => {
    if (inventory) {
      const processedData = inventory.map((item: InventoryItem) => ({
        ...item,
        status:
          item.stock <= item.reorder
            ? item.stock === 0
              ? "critical"
              : "low"
            : "good",
      }));
      setLocalInventory(processedData);
    }
  }, [inventory]);

  const handleImportSuccess = (importedData: InventoryItem[]) => {
    setLocalInventory((prev) => [...prev, ...importedData]);
    // Optionally, make an API call to persist the imported data
    refetch();
  };

  const handleViewMode = () => {
    setViewMode(viewMode === "Table" ? "Card" : "Table");
  };

  const handleDeleteItems = async (selectedIds: string[]) => {
    // Add your deletion logic here
    // e.g., API call to delete items
    try {
      const result = await deleteInventoryItem(selectedIds);

      toast({
        title: "Deleted",
        description: `This is a success toast of`,
        variant: "destructive",
      });

      refetch();
      console.log("Deleting the item: ", selectedIds);
    } catch (error) {
      console.error("Failed to delete items:", error);
    }
  };

  return (
    <div className="w-full">
      <HeaderTitle title="Inventory" />

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b py-0">
          <PageHeader
            handleViewMode={handleViewMode}
            title="All Inventory"
            newButtonLink="/admin/inventory/add-item"
            actions={[
              {
                label: "Import Suppliers",
                icon: <UploadCloudIcon className="h-4 w-4" />,
                // onClick: handleImport,
              },
              {
                label: "Export Suppliers",
                icon: <DownloadCloudIcon className="h-4 w-4" />,
                // onClick: handleExport,
              },
              {
                label: "Preferences",
                icon: <SettingsIcon className="h-4 w-4" />,
                link: "/admin/settings/preferences/inventory",
              },
              {
                label: "Refresh List",
                icon: <RefreshCwIcon className="h-4 w-4" />,
                // onClick: handleRefresh,
              },
            ]}
          />
        </section>
        <section className="p-6 ">
          {loading ? (
            <p>Loading...</p>
          ) : localInventory && localInventory.length > 0 ? (
            <GenericTable
              viewMode={viewMode}
              data={localInventory}
              columns={columns}
              context="inventory"
              onDeleteSelected={handleDeleteItems}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3">
              <Card className="items-center flex flex-col gap-2 p-4">
                <CardTitle>Add new Stock</CardTitle>
                <CardDescription className="flex items-center flex-col gap-4">
                  <p>
                    Create standalone items and services that you buy and sell
                  </p>

                  <Button asChild>
                    <Link to={"/admin/inventory/add-item"}>New Item</Link>
                  </Button>
                </CardDescription>
              </Card>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Inventory;
