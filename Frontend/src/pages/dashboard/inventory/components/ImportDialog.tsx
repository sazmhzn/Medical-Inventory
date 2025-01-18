import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { inventoryKeys } from "@/services/__test_inventoryAPI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";

const ImportDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      toast({
        title: "Invalid File",
        description: "Please select a valid Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/inventory/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const data = await response.json();

      toast({
        title: "Import Successful",
        description: `Successfully imported ${data.itemsImported} items`,
        variant: "success",
      });

      // Refresh inventory data
      await queryClient.invalidateQueries({
        queryKey: inventoryKeys.lists(),
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Inventory</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Required Columns</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>name (required)</li>
                <li>stock (number)</li>
                <li>price (number)</li>
                <li>reorder (number)</li>
                <li>unit</li>
                <li>type</li>
              </ul>
            </AlertDescription>
          </Alert>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
