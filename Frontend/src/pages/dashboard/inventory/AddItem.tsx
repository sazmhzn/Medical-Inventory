import HeaderTitle from "@/components/commons/header-title";
import { PageHeader } from "../components/PageHeader";
import CustomTooltip from "@/components/ToolTipAlert";
import { CircleHelp } from "lucide-react";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";
import { postInventoryItem } from "@/services/InventoryAPI";
import { useCallback, useMemo, useState } from "react";
import { itemFields } from "@/config/ItemFields";
import { useFetchCustomFormsByEntityType } from "@/services/CustomFormAPI";
import { CustomField } from "types/customFields";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AddItem = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    data: customFormsData,
    loading,
    error: customFormsError,
  } = useFetchCustomFormsByEntityType("inventory");

  // Transform custom fields from backend to FieldConfig format
  const transformCustomFields = useCallback(
    (customForms: any): FieldConfig[] => {
      if (!customForms || !customForms[0]?.formConfig?.fields) return [];

      return customForms[0].formConfig.fields.map((field: CustomField) => ({
        name: field.name,
        label: field.label,
        type: field.dataType,
        required: field.isRequired,
        gridWidth: "full",
        section: "custom",
        options: field.options,
      }));
    },
    []
  );

  const units = useMemo(
    () => [
      { value: "kg", label: "Kilogram" },
      { value: "g", label: "Gram" },
      { value: "lb", label: "Pound" },
      { value: "oz", label: "Ounce" },
      { value: "l", label: "Liter" },
      { value: "ml", label: "Milliliter" },
    ],
    []
  );

  // Combine default fields with custom fields
  const allFields = useCallback(() => {
    const customFields = transformCustomFields(customFormsData);
    return [...itemFields, ...customFields];
  }, [customFormsData, transformCustomFields]);

  console.log([allFields]);

  // const fields = [...itemFields, ...customFields];

  // const itemFields: FieldConfig[] = [
  //   // Default Fields Section
  //   {
  //     name: "type",
  //     label: "Type",
  //     type: "radio",
  //     required: true,
  //     gridWidth: "full",
  //     section: "default",
  //     options: [
  //       { value: "GOODS", label: "Good" },
  //       { value: "SERVICE", label: "Service" },
  //     ],
  //     tooltipContent: "Select if this item is a physical good or a service.",
  //   },
  //   {
  //     name: "name",
  //     label: "Name",
  //     type: "text",
  //     gridWidth: "full",
  //     required: true,
  //     section: "default",
  //   },
  //   {
  //     name: "sku",
  //     label: "SKU",
  //     type: "text",
  //     gridWidth: "half",
  //     required: false,
  //     section: "default",
  //   },
  //   {
  //     name: "category",
  //     label: "Category",
  //     type: "select",
  //     gridWidth: "full",
  //     section: "default",
  //     options: [
  //       { value: "medicine", label: "Medicine" },
  //       { value: "equipment", label: "Equipment" },
  //       { value: "supplies", label: "Supplies" },
  //       { value: "supplement", label: "Supplement" },
  //     ],
  //     required: true,
  //   },
  //   {
  //     name: "unit",
  //     label: "Unit",
  //     type: "select",
  //     gridWidth: "half",
  //     section: "default",
  //     options: [
  //       { value: "bottle", label: "Bottle" },
  //       { value: "box", label: "Box" },
  //       { value: "pack", label: "Pack" },
  //       { value: "strips", label: "Strips" },
  //     ],
  //     required: true,
  //   },
  //   {
  //     name: "price",
  //     label: "Price",
  //     type: "number",
  //     gridWidth: "half",
  //     required: true,
  //     section: "default",
  //   },
  //   {
  //     name: "stock",
  //     label: "Opening Stock",
  //     type: "number",
  //     gridWidth: "half",
  //     required: true,
  //     section: "default",
  //   },
  //   {
  //     name: "image",
  //     label: "Product Image",
  //     type: "file",
  //     gridWidth: "full",
  //     required: false,
  //     section: "default",
  //     validation: {
  //       acceptedFileTypes: [".jpg", ".jpeg", ".png"],
  //       maxFileSize: 5 * 1024 * 1024, // 5MB
  //     },
  //   },
  //   {
  //     name: "expiryDate",
  //     label: "Expiry Date",
  //     type: "date",
  //     gridWidth: "half",
  //     required: false,
  //     section: "default",
  //   },

  //   // Other Details Section
  //   {
  //     name: "description",
  //     label: "Description",
  //     type: "text",
  //     gridWidth: "full",
  //     required: false,
  //     section: "other",
  //   },
  //   {
  //     name: "manufacturer",
  //     label: "Manufacturer",
  //     type: "text",
  //     gridWidth: "full",
  //     required: false,
  //     section: "other",
  //   },
  //   {
  //     name: "batchNumber",
  //     label: "Batch Number",
  //     type: "text",
  //     gridWidth: "full",
  //     required: true,
  //     section: "other",
  //   },
  //   {
  //     name: "storageConditions",
  //     label: "Storage Conditions",
  //     type: "text",
  //     gridWidth: "full",
  //     required: false,
  //     section: "other",
  //   },
  //   {
  //     name: "reorder",
  //     label: "Reorder Point",
  //     type: "number",
  //     gridWidth: "half",
  //     required: false,
  //     section: "other",
  //   },
  // ];

  // const { allFields, addCustomField, removeCustomField, getFieldsBySection } =
  //   useFieldManager(itemFields, "inventory");

  const additionalContent = (
    <div>
      <div className="mt-4 p-4">
        <h3 className="text-2xl font-medium">
          Track Inventory for this item{" "}
          <CustomTooltip
            icon={<CircleHelp className="w-4 h-4" />}
            content="Enable this option to track this item's stock based on its sales and purchase transactions."
          />{" "}
        </h3>
        <p className="font-normal text-neutral-400">
          You cannot enable/disable inventory tracking once you've created
          transactions for this item
        </p>
      </div>
      {/* <div className="mt-4 p-4">
        <AddCustomField entityType="inventory" onAddField={addCustomField} />
      </div> */}
      {/* <div className="mt-4 p-4">
        <FieldManager
          defaultFields={itemFields}
          entityType="inventory"
          onFieldsChange={(fields) => {
            // This will be called whenever fields are updated
            console.log("Fields updated:", fields);
          }}
        />
      </div> */}
    </div>
  );

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Separate custom fields from regular fields
      const customFields = allFields().filter(
        (field) => field.section === "custom"
      );
      const customValues: Record<string, any> = {};

      customFields.forEach((field) => {
        if (data[field.name] !== undefined) {
          customValues[field.name] = data[field.name];
          delete data[field.name]; // Remove from main data object
        }
      });

      // Prepare the inventory item data
      const inventoryData = {
        ...data,
        type: data.type === "GOODS" ? "GOODS" : "SERVICE",
        customFormData: customFormsData?.[0]
          ? { id: customFormsData[0].id }
          : null,
        customValue:
          Object.keys(customValues).length > 0
            ? JSON.stringify(customValues)
            : null,
        // Convert base64 image if present
        image: data.image || null,
      };

      const response = await postInventoryItem(inventoryData);
      console.log("Item added successfully:", response);
      // Handle success (redirect or show message)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add inventory item"
      );
      console.error("Error adding item:", err);
    } finally {
      setIsSubmitting(false);
    }

    // try {
    //   // Extract custom field values from the form data
    //   const customFields = getFieldsBySection("custom");
    //   const customFieldValues = customFields.map((field) => ({
    //     fieldId: field.name,
    //     value: data[field.name],
    //   }));

    //   // Create a readable log of the image data
    //   const imageInfo = data.image
    //     ? {
    //         preview: data.image.substring(0, 50) + "...", // First 50 chars of base64
    //         fullLength: data.image.length,
    //         approximateSizeKB: ((data.image.length * 0.75) / 1024).toFixed(2),
    //         type: data.image.split(";")[0].split(":")[1], // Gets mime type
    //       }
    //     : "No image";

    //   // If you need to modify the data before sending
    //   const submissionData = {
    //     ...data,
    //     image: data.image || null, // The base64 string is already here
    //     customFields: customFieldValues,
    //   };
    //   console.log(submissionData);

    //   const result = await postInventoryItem(submissionData);
    //   console.log("Item added successfully:", result);
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    //   alert("There was an error submitting the form. Please try again.");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  if (loading) {
    return <div>Loading custom fields...</div>;
  }

  if (customFormsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading custom fields</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <HeaderTitle title="Item" />

      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-0">
          <PageHeader title="New Inventory" backButtonLink="/admin/inventory" />
        </section>

        <section>
          <DynamicFormGenerator
            // fields={itemFields}\
            fields={allFields()}
            onSubmit={handleSubmit}
            context="inventory"
            title="Add New Item"
            additionalContent={additionalContent}
          />
        </section>
      </div>
    </div>
  );
};

export default AddItem;
