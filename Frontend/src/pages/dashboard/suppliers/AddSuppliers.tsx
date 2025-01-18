import HeaderTitle from "@/components/commons/header-title";
import { PageHeader } from "../components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";
import { useCallback } from "react";
import { useCreateSupplier } from "@/services/SupplierAPI";
import { useFetchCustomFormsByEntityType } from "@/services/CustomFormAPI";
import { CustomField } from "types/customFields";
import { supplierFields } from "@/config/SupplierFields";

const AddSuppliers = () => {
  const {
    data: customFormsData,
    loading,
    error: customFormsError,
  } = useFetchCustomFormsByEntityType("suppliers");

  const { mutate: createSupplier, loading: isLoading, error } = useCreateSupplier();

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

  // Combine default fields with custom fields
  const allFields = useCallback(() => {
    const customFields = transformCustomFields(customFormsData);
    return [...supplierFields, ...customFields];
  }, [customFormsData, transformCustomFields]);

  const handleSubmit = useCallback(
    async (data: Record<string, any>) => {
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
        const supplierData = {
          ...data,
          role: "SUPPLIER",
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

        console.log(supplierData);

        createSupplier(supplierData);
        console.log("Supplier added successfully");
        // Handle success (redirect or show message)
      } catch (err) {
        console.error("Error adding item:", err);
      }
    },
    [createSupplier]
  );

  return (
    <div className="w-full">
      <HeaderTitle title="Supplier" />

      <div className="bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <section className="border-b pb-0">
          <PageHeader title="New Supplier" backButtonLink="/admin/suppliers" />
        </section>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to add supplier"}
            </AlertDescription>
          </Alert>
        )}

        <section>
          <DynamicFormGenerator
            context="supplier"
            fields={allFields()}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </section>
      </div>
    </div>
  );
};

export default AddSuppliers;
