import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  createOrUpdateCustomForm,
  CustomForm,
  CustomFormField,
  updateFormFields,
  useFetchCustomForm,
  useFetchCustomFormsByEntityType,
} from "@/services/CustomFormAPI";
import { useToast } from "@/hooks/use-toast";

// interface CustomField {
//   label: string;
//   name: string;
//   type: string;
//   required: boolean;
//   defaultValue?: string;
//   options?: Array<{ value: string; label: string }>;
// }

const customFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  name: z.string().min(1, "Field name is required"),
  dataType: z.string().min(1, "Field type is required"),
  isRequired: z.enum(["true", "false"]),
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

export interface AddCustomFieldProps {
  entityType: string;
  formName?: string;
  onFieldAdded?: () => void;
}

const AddCustomField = ({
  entityType,
  formName = "inventoryCustomField",
  onFieldAdded,
}: {
  entityType: string;
  formName: string;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState([{ value: "", label: "" }]);
  const [customFields, setCustomFields] = useState<CustomFormField[]>([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(customFieldSchema),
    defaultValues: {
      label: "",
      name: "",
      dataType: "",
      isRequired: "false",
      defaultValue: "",
      options: [],
    },
  });

  useEffect(() => {
    loadExistingFields();
  }, [entityType, formName]);

  const loadExistingFields = async () => {
    try {
      const response = await useFetchCustomForm(entityType, formName);
      if (response?.formConfig?.fields) {
        setCustomFields(response.formConfig.fields);
      }
    } catch (error) {
      console.error("Error loading existing fields:", error);
    }
  };

  const handleDataTypeChange = (value: string) => {
    form.setValue("dataType", value);
    setShowOptions(value === "select" || value === "radio");
    if (!showOptions) {
      setOptions([{ value: "", label: "" }]);
    }
  };

  const addOption = () => {
    setOptions([...options, { value: "", label: "" }]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (
    index: number,
    field: "value" | "label",
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const onSubmit = async (data: any) => {
    try {
      const newField: CustomFormField = {
        name: data.name,
        label: data.label,
        type: data.dataType,
        required: data.isRequired === "true",
        defaultValue: data.defaultValue || "",
        ...(showOptions && { options }),
      };

      await updateFormFields(entityType, formName, "append", [newField]);

      toast({
        title: "Success",
        description: "Field added successfully!",
      });

      form.reset();
      setOptions([{ value: "", label: "" }]);
      setShowOptions(false);
      await loadExistingFields();
      if (onFieldAdded) onFieldAdded();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add field. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add Custom Field</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Field Label */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter field name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter field label" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data Type */}
              <FormField
                control={form.control}
                name="dataType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Type</FormLabel>
                    <Select
                      onValueChange={handleDataTypeChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="radio">Radio</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Required Field */}
              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Required Field</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="required-yes" />
                          <FormLabel htmlFor="required-yes">Yes</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="required-no" />
                          <FormLabel htmlFor="required-no">No</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Default Value */}
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter default value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options */}
              {showOptions && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Options</FormLabel>
                    <Button
                      type="button"
                      onClick={addOption}
                      variant="outline"
                      size="sm"
                    >
                      Add Option
                    </Button>
                  </div>
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-4">
                      <Input
                        placeholder="Option value"
                        value={option.value}
                        onChange={(e) =>
                          updateOption(index, "value", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Option label"
                        value={option.label}
                        onChange={(e) =>
                          updateOption(index, "label", e.target.value)
                        }
                      />
                      {options.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="submit">Add Field</Button>
              </div>
            </form>
          </Form>

          {/* Custom Fields Display */}
          {customFields.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Current Custom Fields</h3>
              <ul className="space-y-2">
                {customFields.map((field, index) => (
                  <li key={index} className="border-b pb-2">
                    <strong>{field.label}</strong> - {field.type}{" "}
                    {field.required && "(Required)"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Custom Fields Display */}
          {customFields.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Current Custom Fields</h3>
              <ul className="space-y-2">
                {customFields.map((field, index) => (
                  <li key={index} className="border-b pb-2">
                    <strong>{field.label}</strong> ({field.name}) - {field.type}{" "}
                    {field.required && "(Required)"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AddCustomField;
