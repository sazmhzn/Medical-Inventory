import React, { useState } from "react";
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

// Custom field validation schema
const customFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  dataType: z.string().min(1, "Data type is required"),
  isRequired: z.string(),
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

const AddCustomField = ({ entityType, onAddField }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState([{ value: "", label: "" }]);

  const form = useForm({
    resolver: zodResolver(customFieldSchema),
    defaultValues: {
      label: "",
      dataType: "",
      isRequired: "false",
      defaultValue: "",
      options: [],
    },
  });

  const handleDataTypeChange = (value) => {
    form.setValue("dataType", value);
    setShowOptions(value === "select" || value === "radio");
    if (!showOptions) {
      setOptions([{ value: "", label: "" }]);
    }
  };

  const addOption = () => {
    setOptions([...options, { value: "", label: "" }]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const onSubmit = (data) => {
    const fieldConfig = {
      name: data.label.toLowerCase().replace(/\s+/g, "_"),
      label: data.label,
      type: data.dataType,
      required: data.isRequired === "true",
      gridWidth: "full",
      defaultValue: data.defaultValue || "",
      entityType,
      ...(showOptions && { options }),
    };
    console.log(fieldConfig);
    console.log(data);
    onAddField(fieldConfig);
    form.reset();
    setOptions([{ value: "", label: "" }]);
    setShowOptions(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add Custom Field</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex justify-end space-x-4">
              <Button type="submit">Add Field</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCustomField;
