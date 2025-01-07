import React, { useState, useEffect } from "react";
import { z } from "zod";

// Types
export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "tel"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "date"
    | "popover";
  required?: boolean;
  gridWidth?: "full" | "half" | "third";
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    customValidation?: z.ZodType<any>;
  };
  tooltipContent?: string;
  defaultValue?: any;
  section: "default" | "other" | "custom";
}

interface CustomField extends FieldConfig {
  id: string;
  entityType: string;
}

export interface FieldManagerProps {
  defaultFields: FieldConfig[];
  entityType: string;
  onFieldsChange: (fields: FieldConfig[]) => void;
}

// Validation schema for custom fields
const customFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.string().min(1, "Field type is required"),
  required: z.boolean(),
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

export const useFieldManager = (
  defaultFields: FieldConfig[],
  entityType: string
) => {
  const [allFields, setAllFields] = useState<FieldConfig[]>(defaultFields);

  useEffect(() => {
    // Load custom fields from localStorage
    const savedCustomFields = localStorage.getItem(
      `customFields_${entityType}`
    );
    if (savedCustomFields) {
      const customFields: CustomField[] = JSON.parse(savedCustomFields);
      // Convert custom fields to FieldConfig format and add section
      const formattedCustomFields: FieldConfig[] = customFields.map(
        (field) => ({
          ...field,
          section: "custom",
          gridWidth: field.gridWidth || "full",
        })
      );

      // Merge default fields with custom fields
      setAllFields([...defaultFields, ...formattedCustomFields]);
    }
  }, [entityType, defaultFields]);

  const addCustomField = (fieldConfig: Omit<FieldConfig, "section" | "id">) => {
    const newField: FieldConfig = {
      ...fieldConfig,
      section: "custom",
      gridWidth: fieldConfig.gridWidth || "full",
      // id: crypto.randomUUID(),
    };

    const updatedFields = [...allFields, newField];
    setAllFields(updatedFields);

    // Save only custom fields to localStorage
    const customFields = updatedFields.filter(
      (field) => field.section === "custom"
    );
    localStorage.setItem(
      `customFields_${entityType}`,
      JSON.stringify(customFields)
    );

    return updatedFields;
  };

  const removeCustomField = (fieldName: string) => {
    const updatedFields = allFields.filter(
      (field) => !(field.section === "custom" && field.name === fieldName)
    );
    setAllFields(updatedFields);

    // Save only custom fields to localStorage
    const customFields = updatedFields.filter(
      (field) => field.section === "custom"
    );
    localStorage.setItem(
      `customFields_${entityType}`,
      JSON.stringify(customFields)
    );

    return updatedFields;
  };

  const getFieldsBySection = (section: "default" | "other" | "custom") => {
    return allFields.filter((field) => field.section === section);
  };

  return {
    allFields,
    addCustomField,
    removeCustomField,
    getFieldsBySection,
  };
};
