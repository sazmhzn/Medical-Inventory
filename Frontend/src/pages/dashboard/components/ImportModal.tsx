import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateSupplier } from "@/services/SupplierAPI";
import { Loader2 } from "lucide-react";
import { importFromExcel } from "@/lib/excel-utils";
import { ApiResponse } from "../suppliers/Suppliers";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal = ({ isOpen, onClose }: ImportModalProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const createSupplier = useCreateSupplier();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const handleApiResponse = (response: ApiResponse) => {
      if (response.isSuccess === "true") {
        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    };

    setIsUploading(true);
    try {
      const suppliers = await importFromExcel(file);

      // Create suppliers and track results
      const results = await Promise.allSettled(
        suppliers.map(async (supplier) => {
          const formData = new FormData();
          Object.entries(supplier).forEach(([key, value]) => {
            formData.append(key, value?.toString() ?? "");
          });
          return createSupplier.mutateAsync(formData);
        })
      );

      // Count successes and failures
      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successful > 0 && failed > 0) {
        toast({
          title: "Partial Import",
          description: `Successfully imported ${successful} suppliers, but failed to import ${failed} suppliers.`,
          variant: "warning",
        });
      } else if (failed === 0) {
        toast({
          title: "Success",
          description: `Successfully imported ${successful} suppliers.`,
          variant: "success",
        });
        onClose();
      } else {
        const error = results.find(
          (result) => result.status === "rejected"
        ) as PromiseRejectedResult;
        const response = error.reason?.response?.data as ApiResponse;

        if (response?.message) {
          handleApiResponse(response);
        } else {
          toast({
            title: "Import Failed",
            description:
              "Failed to import suppliers. Please check your file and try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description:
          error instanceof Error ? error.message : "Failed to import suppliers",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Suppliers</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              Upload an Excel file containing supplier information
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          {isUploading && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
