import { useParams, useNavigate } from "react-router-dom";
import {
  updateInventoryItem,
  useFetchInventoryById,
} from "@/services/InventoryAPI";
import HeaderTitle from "@/components/commons/header-title";
import { CircleHelp } from "lucide-react";
import CustomTooltip from "@/components/ToolTipAlert";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";
import { Skeleton } from "@/components/ui/skeleton";
import { BackHeader } from "../../components/PageHeader";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: itemDetails, loading, error } = useFetchInventoryById(id);

  const units = [
    { value: "bottle", label: "Bottle" },
    { value: "box", label: "Box" },
    { value: "pack", label: "Pack" },
    { value: "strips", label: "Strips" },
  ];

  const itemFields: FieldConfig[] = [
    {
      name: "type",
      label: "Type",
      type: "radio",
      required: true,
      gridWidth: "full",
      options: [
        { value: "GOODS", label: "Good" },
        { value: "SERVICE", label: "Service" },
      ],
      tooltipContent: "Select if this item is a physical good or a service.",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      gridWidth: "full",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      gridWidth: "full",
      required: false,
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      gridWidth: "half",
      required: false,
    },
    {
      name: "unit",
      label: "Unit",
      type: "select",
      gridWidth: "half",
      options: units,
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      gridWidth: "full",
      options: [
        { value: "medicine", label: "Medicine" },
        { value: "equipment", label: "Equipment" },
        { value: "supplies", label: "Supplies" },
        { value: "supplement", label: "Supplement" },
      ],
      required: true,
    },
    {
      name: "stock",
      label: "Current Stock",
      type: "number",
      gridWidth: "half",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      gridWidth: "half",
      required: true,
    },
    {
      name: "reorder",
      label: "Reorder Point",
      type: "number",
      gridWidth: "half",
      required: false,
    },
    {
      name: "expiryDate",
      label: "Expiry Date",
      type: "date",
      gridWidth: "half",
      required: false,
    },
    {
      name: "manufacturer",
      label: "Manufacturer",
      type: "text",
      gridWidth: "full",
      required: false,
    },
    {
      name: "batchNumber",
      label: "Batch Number",
      type: "text",
      gridWidth: "full",
      required: true,
    },
    {
      name: "storageConditions",
      label: "Storage Conditions",
      type: "text",
      gridWidth: "full",
      required: false,
    },
    {
      name: "image",
      label: "Product Image",
      type: "file",
      gridWidth: "full",
      required: false,
      validation: {
        acceptedFileTypes: [".jpg", ".jpeg", ".png"],
        maxFileSize: 5 * 1024 * 1024,
      },
    },
  ];

  const handleSubmit = (data: Record<string, any>) => {
    try {
      // const result = await updateInventoryItem(id, data);

      alert("Item added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const additionalContent = (
    <div className="mt-4 p-4">
      <h3 className="text-2xl font-medium">
        Track Inventory for this item{" "}
        <CustomTooltip
          icon={<CircleHelp className="w-4 h-4" />}
          content="Enable this option to track this item's stock based on its sales and purchase transactions."
        />
      </h3>
      <p className="font-normal text-neutral-400">
        You cannot enable/disable inventory tracking once you've created
        transactions for this item
      </p>
    </div>
  );

  if (loading) {
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
          <BackHeader title="Edit Inventory Item" backTo="/admin/inventory" />
        </section>

        <section>
          <DynamicFormGenerator
            fields={itemFields}
            context="inventory"
            onSubmit={handleSubmit}
            title="Edit Item"
            additionalContent={additionalContent}
            initialValues={itemDetails} // Pass the fetched data as initial values
          />
        </section>
      </div>
    </div>
  );
};

export default EditItem;
