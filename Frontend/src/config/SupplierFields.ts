import { FieldConfig } from "@/pages/test/__testDynamicForm";
import { z } from "zod";

export const supplierFields: FieldConfig[] = [
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
      "Business suppliers are associated with accounts in CRM, while individual suppliers are independent contractors.",
    section: "default",
  },
  {
    name: "orgName",
    label: "Organization Name",
    type: "text",
    required: true,
    validation: {
      customValidation: z.string().min(1, "Supplier name is required"),
    },
    gridWidth: "full",
    section: "default",
  },
  {
    name: "name",
    label: "Supplier Name",
    type: "text",
    required: true,
    validation: {
      customValidation: z.string().min(1, "Supplier name is required"),
    },
    section: "default",
  },
  {
    name: "username",
    label: "Display Name",
    type: "text",
    required: true,
    validation: {
      customValidation: z.string().min(1, "Display name is required"),
    },
    section: "default",
  },
  {
    name: "emailAddress",
    label: "Email Address",
    type: "text",
    required: true,
    validation: {
      customValidation: z.string().email("Invalid email address"),
    },
    section: "default",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    required: true,
    validation: {
      customValidation: z.string().optional(),
    },
    section: "default",
  },
  {
    name: "contact",
    label: "Work Phone",
    type: "tel",
    required: false,
    gridWidth: "half",
    validation: {
      customValidation: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .optional(),
    },
    section: "default",
  },
  {
    name: "phonePersonal",
    label: "Personal Phone",
    type: "tel",
    required: true,
    gridWidth: "half",
    validation: {
      customValidation: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    },
    section: "default",
  },
  {
    name: "isPreferred",
    label: "Preferred Supplier",
    type: "checkbox",
    required: false,
    gridWidth: "full",
    section: "default",
  },
  {
    name: "document",
    label: "Company Document",
    type: "file",
    required: false,
    gridWidth: "full",
    validation: {
      acceptedFileTypes: [".pdf", ".doc", ".docx"],
      maxFileSize: 5 * 1024 * 1024,
      message: "Please upload a valid document (PDF, DOC, DOCX) under 5MB",
    },
    section: "other", // Added section
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    required: true,
    gridWidth: "full",
    section: "default",
  },
];
