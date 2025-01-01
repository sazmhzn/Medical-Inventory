import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldConfig } from "@/pages/test/__testDynamicForm";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { useForm } from "react-hook-form";

// Types for custom field management
interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  context: "inventory" | "supplier" | "order";
}

// Extended FieldConfig to include order
interface ExtendedFieldConfig extends FieldConfig {
  order: number;
  defaultValue?: any;
}

const itemFields: ExtendedFieldConfig[] = [
  {
    name: "type",
    label: "Type",
    type: "radio",
    required: true,
    gridWidth: "full",
    order: 1,
    defaultValue: "GOODS",
    options: [
      { value: "GOODS", label: "Good" },
      { value: "SERVICE", label: "Service" },
    ],
    tooltipContent: "Select if this item is a physical good or a service.",
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    gridWidth: "full",
    required: true,
    order: 2,
    defaultValue: "",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    gridWidth: "full",
    required: false,
    order: 3,
    defaultValue: "",
  },
  // ... other existing fields with order and defaultValue
];

// Custom Field Form Component
const CustomFieldForm: React.FC<{
  onSubmit: (field: CustomField) => void;
  context: string;
}> = ({ onSubmit, context }) => {
  const form = useForm<CustomField>({
    defaultValues: {
      context: context as "inventory" | "supplier" | "order",
      type: "text",
      required: false,
      order: 999, // Default to end of list
    },
  });

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "select", label: "Select" },
    { value: "date", label: "Date" },
    { value: "checkbox", label: "Checkbox" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Required Field</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit">Add Custom Field</Button>
      </form>
    </Form>
  );
};
