import { FieldConfig } from "@/pages/test/__testDynamicForm";

export const orderFields: FieldConfig[] = [
  {
    name: "companyName",
    label: "Company",
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
    name: "salesOrder",
    label: "Sales Order #",
    type: "text",
    required: true,
    gridWidth: "half",
    section: "default",
  },
  {
    name: "salesOrderDate",
    label: "Sales Order Date",
    type: "date",
    required: true,
    gridWidth: "half",
    section: "default",
  },
  {
    name: "shipmentDate",
    label: "Expected Shipment Date",
    type: "date",
    required: true,
    gridWidth: "half",
    section: "default",
  },
  {
    name: "paymentTerms",
    label: "Payment Terms",
    type: "select",
    required: true,
    gridWidth: "half",
    section: "default",
    options: [
      { value: "net30", label: "Net 30" },
      { value: "net60", label: "Net 60" },
      { value: "immediate", label: "Immediate" },
    ],
  },
];
