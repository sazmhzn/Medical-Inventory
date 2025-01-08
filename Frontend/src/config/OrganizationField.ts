import { FieldConfig } from "@/pages/test/__testDynamicForm";

export const itemFields: FieldConfig[] = [
  // Default Fields Section

  {
    name: "orgName",
    label: "Organization name",
    type: "text",
    gridWidth: "full",
    required: true,
    section: "default",
  },
  {
    name: "sku",
    label: "SKU",
    type: "text",
    gridWidth: "half",
    required: false,
    section: "default",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    gridWidth: "full",
    section: "default",
    options: [
      { value: "medicine", label: "Medicine" },
      { value: "equipment", label: "Equipment" },
      { value: "supplies", label: "Supplies" },
      { value: "supplement", label: "Supplement" },
    ],
    required: true,
  },
  {
    name: "unit",
    label: "Unit",
    type: "select",
    gridWidth: "half",
    section: "default",
    options: [
      { value: "bottle", label: "Bottle" },
      { value: "box", label: "Box" },
      { value: "pack", label: "Pack" },
      { value: "strips", label: "Strips" },
    ],
    required: true,
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    gridWidth: "half",
    required: true,
    section: "default",
  },
  {
    name: "stock",
    label: "Opening Stock",
    type: "number",
    gridWidth: "half",
    required: true,
    section: "default",
  },
  {
    name: "image",
    label: "Product Image",
    type: "file",
    gridWidth: "full",
    required: false,
    section: "default",
    validation: {
      acceptedFileTypes: [".jpg", ".jpeg", ".png"],
      maxFileSize: 5 * 1024 * 1024, // 5MB
    },
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    gridWidth: "half",
    required: false,
    section: "default",
  },

  // Other Details Section
  {
    name: "description",
    label: "Description",
    type: "text",
    gridWidth: "full",
    required: false,
    section: "other",
  },
  {
    name: "manufacturer",
    label: "Manufacturer",
    type: "text",
    gridWidth: "full",
    required: false,
    section: "other",
  },
  {
    name: "batchNumber",
    label: "Batch Number",
    type: "text",
    gridWidth: "full",
    required: true,
    section: "other",
  },
  {
    name: "storageConditions",
    label: "Storage Conditions",
    type: "text",
    gridWidth: "full",
    required: false,
    section: "other",
  },
  {
    name: "reorder",
    label: "Reorder Point",
    type: "number",
    gridWidth: "half",
    required: false,
    section: "other",
  },
];
