import { z } from "zod";
// import DynamicFormGenerator from "../dashboard/components/DynamicFormGenerator";
import DynamicFormGenerator, { FieldConfig } from "./__testDynamicForm";

const SupplierFormWithTabs = () => {
  // const [customFields, setCustomFields] = useState([]);

  // Default fields configuration
  const supplierFields: FieldConfig[] = [
    {
      name: "type",
      label: "Supplier Type",
      type: "radio",
      required: true,
      gridWidth: "full",
      options: [
        { value: "BUSINESS", label: "Business" },
        { value: "INDIVIDUAL", label: "Individual" },
      ],
      tooltipContent:
        "The contacts which are associated to any Account in CRM is of type Business and the other contacts will be of type Individual.",
    },
    {
      name: "name",
      label: "Supplier Name",
      type: "text",
      required: true,
    },
    {
      name: "displayName",
      label: "Display Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      required: true,
      validation: {
        customValidation: z.string().email("Invalid email address"),
      },
    },
    {
      name: "phoneWork",
      label: "Work Phone",
      type: "tel",
      required: false,
      gridWidth: "half",
      validation: {
        customValidation: z
          .string()
          .min(10, "Phone number must be at least 10 digits")
          .max(10, "Phone number must not exceed 10 digits")
          .regex(/^\d+$/, "Phone number must contain only digits")
          .transform((val) => (val ? val.replace(/\D/g, "") : val)),
      },
    },
    {
      name: "phonePersonal",
      label: "Personal Phone",
      type: "tel",
      required: true,
      gridWidth: "half",
      validation: {
        customValidation: z.coerce
          .number()
          .min(10, "Phone number must be at least 10 digits")
          .max(10, "Phone number must not exceed 10 digits")
          .optional(),
      },
    },
    {
      name: "isPreferred",
      label: "Preferred Supplier",
      type: "checkbox",
      required: false,
      gridWidth: "full",
    },
    {
      name: "document",
      label: "Company Document",
      type: "file",
      required: false,
      
      validation: {
        acceptedFileTypes: [".pdf", ".doc", ".docx"],
        maxFileSize: 5 * 1024 * 1024, // 5MB
        message: "Please upload a valid document (PDF, DOC, DOCX) under 5MB",
      },
    },
  ];

  const handleSupplierSubmit = (data: any) => {
    console.log("Supplier Submitted:", data);
    // Implement your submit logic
  };

  return (
    <div className="">
      {/* Default Fields Section */}
      <DynamicFormGenerator
        context="supplier"
        fields={supplierFields}
        onSubmit={handleSupplierSubmit}
      />
    </div>
  );
};

export default SupplierFormWithTabs;
