import { useParams, useNavigate } from "react-router-dom";
import HeaderTitle from "@/components/commons/header-title";
import DynamicFormGenerator from "@/pages/test/__testDynamicForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomFields } from "@/lib/customFileManager";
import { toast } from "@/hooks/use-toast";
import { BackHeader } from "../components/PageHeader";
import { supplierFields } from "@/config/SupplierFields";
import { useSupplier, useUpdateSupplier } from "@/services/SupplierAPI";
import { useCallback } from "react";

const EditSuppliers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: itemDetails, isLoading, error } = useSupplier(id);

  const customFields = getCustomFields("custom");

  const fields = [...supplierFields, ...customFields];

  // useFieldManager(itemFields, "supplier");

  const handleSubmit = useCallback(
    async (data: Record<string, any>) => {
      try {
        useUpdateSupplier(id, data);
        // console.log(result);
        toast({
          title: "Item Edited Successfully",
          description: "Item edited successfully! Redirecting to...",
        });
        navigate("/admin/suppliers");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    [useUpdateSupplier]
  );

  if (isLoading) {
    return (
      <div className="w-full p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">Error loading item details</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <HeaderTitle title="Edit Item" />
      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-0">
          <BackHeader title="Edit Supplier Item" backTo="/admin/suppliers" />
        </section>

        <section>
          <DynamicFormGenerator
            fields={fields}
            context="supplier"
            onSubmit={handleSubmit}
            title="Edit Supplier Details"
            initialValues={itemDetails} // Pass the fetched data as initial values
          />
        </section>
      </div>
    </div>
  );
};

export default EditSuppliers;
