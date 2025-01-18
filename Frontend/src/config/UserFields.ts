import { FieldConfig } from "@/pages/test/__testDynamicForm";
import { z } from "zod";

export const userFields: FieldConfig[] = [
  // Default Fields Section
  {
    name: "username",
    label: "Username",
    type: "text",
    gridWidth: "half",
    required: true,
    section: "default",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    gridWidth: "half",
    required: true,
    section: "default",
    options: [
      { value: "ROLE_ADMIN", label: "Admin" },
      { value: "ROLE_USER", label: "User" },
      { value: "ROLE_SUPPLIER", label: "Supplier" },
    ],
  },
  {
    name: "name",
    label: "Full Name",
    type: "text",
    gridWidth: "full",
    required: true,
    section: "default",
  },
  {
    name: "orgName",
    label: "Organization Name",
    type: "text",
    gridWidth: "full",
    required: false,
    section: "default",
  },
  {
    name: "emailAddress",
    label: "Email Address",
    type: "text",
    gridWidth: "full",
    required: true,
    section: "default",
    validation: {
      customValidation: z.string().email("Invalid email address"),
    },
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    required: true,
    gridWidth: "full",
    section: "default",
  },
  {
    name: "contact",
    label: "Contact Number",
    type: "tel",
    gridWidth: "half",
    required: false,
    section: "default",
    validation: {
      customValidation: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .optional(),
    },
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    gridWidth: "full",
    required: false,
    section: "default",
  },
  // {
  //   name: "document",
  //   label: "Document",
  //   type: "file",
  //   gridWidth: "full",
  //   required: false,
  //   section: "default",
  //   validation: {
  //     acceptedFileTypes: [".pdf", ".doc", ".docx"],
  //     maxFileSize: 5 * 1024 * 1024, // 5MB
  //   },
  // },
  {
    name: "image",
    label: "Profile Image",
    type: "file",
    gridWidth: "full",
    required: false,
    section: "default",
    validation: {
      acceptedFileTypes: [".jpg", ".jpeg", ".png"],
      maxFileSize: 5 * 1024 * 1024, // 5MB
    },
  },
];
