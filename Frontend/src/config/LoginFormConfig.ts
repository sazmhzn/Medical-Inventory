import { FieldConfig } from "@/pages/test/__testDynamicForm";

export const loginField: FieldConfig[] = [
  // Default Fields Section
  {
    name: "orrgName",
    label: "Oreganization Name",
    type: "text",
    gridWidth: "full",
    required: true,
    section: "default",
    tooltipContent: "Select if this item is a physical good or a service.",
  },
  {
    name: "username",
    label: "username",
    type: "text",
    gridWidth: "full",
    required: true,
    section: "default",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    gridWidth: "full",
    required: true,
    section: "default",
  },
];
