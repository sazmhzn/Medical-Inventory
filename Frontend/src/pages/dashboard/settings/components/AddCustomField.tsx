import { z } from "zod";
import { useNavigate } from "react-router-dom";
import DynamicFormGenerator, {
  FieldConfig,
} from "@/pages/test/__testDynamicForm";

const customFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  dataType: z.enum([
    "text",
    "number",
    "email",
    "phone",
    "select",
    "date",
    "checkbox",
  ]),
  isRequired: z.boolean(),
  defaultValue: z.string().optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
});

const addCustomFieldConfig: FieldConfig[] = [
  {
    name: "label",
    label: "Field Label",
    gridWidth: "full",
    type: "text",
    required: true,
    validation: {
      customValidation: z.string().min(1, "Label is required"),
    },
  },
  {
    name: "dataType",
    label: "Data Type",
    gridWidth: "full",
    type: "select",
    required: true,
    options: [
      { value: "text", label: "Text" },
      { value: "number", label: "Number" },
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone" },
      { value: "select", label: "Select" },
      { value: "date", label: "Date" },
      { value: "checkbox", label: "Checkbox" },
    ],
  },
  {
    name: "isRequired",
    label: "Required Field",
    type: "radio",
    required: true,
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    validation: {
      customValidation: z.coerce.boolean(),
    },
  },
  {
    name: "defaultValue",
    label: "Default Value",
    type: "text",
    gridWidth: "full",
    required: false,
  },
];

interface AddCustomFieldProps {
  entityType: "inventory" | "suppliers" | "order";
}

const AddCustomField: React.FC<AddCustomFieldProps> = ({ entityType }) => {
  const navigate = useNavigate();

  const handleCustomFieldSubmit = (data: any) => {
    // Save to localStorage or API
    const savedFields = localStorage.getItem(`customFields_${entityType}`);
    const fields = savedFields ? JSON.parse(savedFields) : [];
    const newField = {
      ...data,
      id: crypto.randomUUID(),
      entityType,
    };
    fields.push(newField);
    localStorage.setItem(`customFields_${entityType}`, JSON.stringify(fields));
    navigate(`/admin/settings/preferences/${entityType}`);
  };

  return (
    <div className="p-4">
      <DynamicFormGenerator
        fields={addCustomFieldConfig}
        onSubmit={handleCustomFieldSubmit}
        isCustomField={true}
      />
    </div>
  );
};

export default AddCustomField;
