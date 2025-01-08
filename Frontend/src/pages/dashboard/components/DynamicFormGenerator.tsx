import React, { memo, useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomTooltip from "@/components/ToolTipAlert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Types for form field configuration
type BaseFieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "radio" | "popover";
  required?: boolean;
  validation?: z.ZodType;
  options?: { value: string; label: string }[];
  className?: string;
  tooltipContent?: string;
};

type SelectFieldConfig = BaseFieldConfig & {
  type: "select";
  options: { value: string; label: string }[];
};

export type FieldConfig = BaseFieldConfig | SelectFieldConfig;

// Dynamic Form Generator Component
interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
  title?: string;
  additionalContent?: React.ReactNode;
}

const MemoizedInput = memo(({ field, inputProps }: any) => (
  <Input
    type={inputProps.type}
    className="bg-white focus-within:bg-white active:bg-white"
    {...field}
    required={inputProps.required}
  />
));

const MemoizedSelect = memo(({ field, options, label }: any) => (
  <Select onValueChange={field.onChange} defaultValue={field.value}>
    <SelectTrigger>
      <SelectValue placeholder={`Select ${label}`} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option: any) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
));

const MemoizedCheckbox = memo(({ field }: any) => (
  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
));

const MemoizedRadioGroup = memo(
  ({ field, options, label, tooltipContent }: any) => (
    <div className="flex gap-4 items-center">
      <p className="inline-flex items-center gap-2 w-[30%]">
        {label}
        {tooltipContent && (
          <CustomTooltip
            icon={<CircleHelp className="w-4 h-4" />}
            content={tooltipContent}
          />
        )}
      </p>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={options?.[0]?.value}
        className="flex gap-4 font-normal"
      >
        {options?.map((option: any) => (
          <div key={option.value} className="space-x-2 flex items-center">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              htmlFor={option.value}
              className="font-normal w-[35%] text-base"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
);

const DynamicFormGenerator: React.FC<DynamicFormProps> = memo(
  ({ fields, onSubmit, title, additionalContent }) => {
    const units = useMemo(
      () => [
        { value: "kg", label: "Kilogram" },
        { value: "g", label: "Gram" },
        { value: "lb", label: "Pound" },
        { value: "oz", label: "Ounce" },
        { value: "l", label: "Liter" },
        { value: "ml", label: "Milliliter" },
      ],
      []
    );

    // Memoize schema generation
    const formSchema = useMemo(() => {
      const generateSchema = (fields: FieldConfig[]) => {
        const schemaFields: { [key: string]: z.ZodType } = {};

        fields.forEach((field) => {
          let fieldValidation: z.ZodType;

          // Existing validation logic
          if (field.required) {
            switch (field.type) {
              case "text":
                fieldValidation = z.string().min(1, ` is required`);
                break;
              case "number":
                fieldValidation = z.coerce
                  .number()
                  .min(0, `${field.label} must be a positive number`);
                break;
              case "select":
              case "radio":
              case "popover":
                fieldValidation = z
                  .string()
                  .nonempty(`${field.label} is required`);
                break;
              case "checkbox":
                fieldValidation = z.boolean();
                break;
              default:
                fieldValidation = z.string();
            }
          } else {
            switch (field.type) {
              case "text":
                fieldValidation = z.string().optional();
                break;
              case "number":
                fieldValidation = z.coerce
                  .number()
                  .positive(`${field.label} must be positive`)
                  .optional();
                break;
              case "select":
              case "radio":
              case "popover":
                fieldValidation = z.string().optional();
                break;
              case "checkbox":
                fieldValidation = z.boolean().optional();
                break;
              default:
                fieldValidation = z.string().optional();
            }
          }

          schemaFields[field.name] = field.validation || fieldValidation;
        });

        return z.object(schemaFields);
      };

      return generateSchema(fields);
    }, [fields]);

    // Memoize default values
    const defaultValues = useMemo(() => {
      const defaults: { [key: string]: any } = {};

      fields.forEach((field) => {
        switch (field.type) {
          case "text":
            defaults[field.name] = "";
            break;
          case "number":
            defaults[field.name] = 0;
            break;
          case "select":
          case "radio":
            defaults[field.name] = "";
            break;
          case "checkbox":
            defaults[field.name] = false;
            break;
        }
      });

      return defaults;
    }, [fields]);

    // Dynamically generate Zod schema based on fields
    // const generateSchema = (fields: FieldConfig[]) => {
    //   const schemaFields: { [key: string]: z.ZodType } = {};

    //   fields.forEach((field) => {
    //     let fieldValidation: z.ZodType;

    //     // Default validation
    //     if (field.required) {
    //       switch (field.type) {
    //         case "text":
    //           fieldValidation = z.string().min(1, `${field.label} is required`);
    //           break;
    //         case "number":
    //           fieldValidation = z.coerce
    //             .number()
    //             .min(0, `${field.label} must be a positive number`);
    //           break;

    //         case "select":
    //         case "radio":
    //         case "popover":
    //           fieldValidation = z
    //             .string()
    //             .nonempty(`${field.label} is required`);
    //           break;
    //         case "checkbox":
    //           fieldValidation = z.boolean();
    //           break;
    //         default:
    //           fieldValidation = z.string();
    //       }
    //     } else {
    //       // Optional fields
    //       switch (field.type) {
    //         case "text":
    //           fieldValidation = z.string().optional();
    //           break;
    //         case "number":
    //           fieldValidation = z.coerce
    //             .number()
    //             .positive(`${field.label} must be positive`);
    //           break;

    //         case "select":
    //         case "radio":
    //         case "popover":
    //           fieldValidation = z.string().optional();
    //           break;
    //         case "checkbox":
    //           fieldValidation = z.boolean().optional();
    //           break;
    //         default:
    //           fieldValidation = z.string().optional();
    //       }
    //     }

    //     schemaFields[field.name] = field.validation || fieldValidation;
    //   });

    //   return z.object(schemaFields);
    // };

    // Generate default values
    // const generateDefaultValues = (fields: FieldConfig[]) => {
    //   const defaults: { [key: string]: any } = {};

    //   fields.forEach((field) => {
    //     switch (field.type) {
    //       case "text":
    //         defaults[field.name] = "";
    //         break;
    //       case "number":
    //         defaults[field.name] = 0;
    //         break;
    //       case "select":
    //       case "radio":
    //         defaults[field.name] = "";
    //         break;
    //       case "checkbox":
    //         defaults[field.name] = false;
    //         break;
    //     }
    //   });

    //   return defaults;
    // };

    // Generate dynamic schema and default values
    // const formSchema = generateSchema(fields);
    // const defaultValues = generateDefaultValues(fields);

    // Use form with dynamic schema
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues,
      mode: "onChange",
    });

    const [open, setOpen] = useState(false);

    // Render dynamic form fields
    const renderFormField = useCallback(
      (field: FieldConfig) => {
        switch (field.type) {
          case "text":
          case "number":
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: inputField }) => (
                  <FormItem className="flex gap-4 items-center">
                    <FormLabel className="w-[35%]">{field.label}</FormLabel>
                    <div className="w-full flex flex-col">
                      <FormControl>
                        {/* <Input
                        type={field.type}
                        className="bg-white focus-within:bg-white active:bg-white"
                        {...inputField}
                        required={field.required}
                      /> */}
                        <MemoizedInput
                          field={inputField}
                          inputProps={{
                            type: field.type,
                            required: field.required,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            );

          case "select":
            const selectField = field as SelectFieldConfig;
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: selectProps }) => (
                  <FormItem className="flex gap-4 items-center">
                    <FormLabel className="w-[35%]">{field.label}</FormLabel>
                    <div className="w-full flex flex-col">
                      <FormControl>
                        {/* <Select
                        onValueChange={selectProps.onChange}
                        defaultValue={selectProps.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {selectField.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}

                        <MemoizedSelect
                          field={selectProps}
                          options={selectField.options}
                          label={field.label}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            );

          case "radio":
            return (
              <div key={field.name} className="flex gap-4 items-center">
                {/* <p className="inline-flex items-center gap-2 w-[30%]">
                  {field.label}
                  {field.tooltipContent && (
                    <CustomTooltip
                      icon={<CircleHelp className="w-4 h-4" />}
                      content={field.tooltipContent}
                    />
                  )}
                </p> */}
                <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: radioField }) => (
                    // <RadioGroup
                    //   {...radioField}
                    //   className="flex gap-4 font-normal"
                    //   onValueChange={radioField.onChange}
                    //   defaultValue={field.options?.[0]?.value}
                    // >
                    //   {field.options?.map((option) => (
                    //     <div
                    //       key={option.value}
                    //       className="space-x-2 flex items-center"
                    //     >
                    //       <RadioGroupItem
                    //         value={option.value}
                    //         id={option.value}
                    //       />
                    //       <Label
                    //         htmlFor={option.value}
                    //         className="font-normal w-[35%] text-base"
                    //       >
                    //         {option.label}
                    //       </Label>
                    //     </div>
                    //   ))}
                    // </RadioGroup>
                    <MemoizedRadioGroup
                      field={radioField}
                      options={field.options}
                      label={field.label}
                      tooltipContent={field.tooltipContent}
                    />
                  )}
                />
              </div>
            );

          case "checkbox":
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: checkboxField }) => (
                  <FormItem className="flex gap-4 items-center">
                    <FormLabel className="w-[35%]">{field.label}</FormLabel>
                    <div className="w-full flex flex-col">
                      <FormControl>
                        {/* <Checkbox
                        checked={checkboxField.value}
                        onCheckedChange={checkboxField.onChange}
                      /> */}
                        <MemoizedCheckbox field={checkboxField} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            );

          case "popover":
            return (
              <div key={field.name} className="flex items-center gap-4">
                <Label htmlFor={field.name} className="w-[35%]">
                  {field.label}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {form.watch(field.name)
                        ? units.find(
                            (unit) => unit.value === form.watch(field.name)
                          )?.label
                        : "Select unit..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[320px]">
                    <Command className="w-full">
                      <CommandInput placeholder="Search unit..." />
                      <CommandList>
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandGroup>
                          {units.map((unit) => (
                            <CommandItem
                              key={unit.value}
                              value={unit.value}
                              onSelect={(currentValue) => {
                                form.setValue(field.name, currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.watch(field.name) === unit.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {unit.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            );
          // case "date":
          //   const [date, setDate] = useState<Date>();

          //   return (
          //     <FormField
          //       key={field.name}
          //       control={form.control}
          //       name={field.name}
          //       render={({ field: dateField }) => (
          //         <FormItem className="flex gap-4 items-center">
          //           <FormLabel className="w-[35%]">{field.label}</FormLabel>
          //           <div className="w-full flex flex-col">
          //             <FormControl>
          //               {/* <DatePicker
          //                 selected={dateField.value}
          //                 onSelect={dateField.onChange}
          //               /> */}
          //               <Popover>
          //                 <PopoverTrigger asChild>
          //                   <Button
          //                     variant={"outline"}
          //                     selected={dateField.value}
          //                     onSelect={dateField.onChange}
          //                     className={cn(
          //                       "w-[240px] justify-start text-left font-normal",
          //                       !date && "text-muted-foreground"
          //                     )}
          //                   >
          //                     <CalendarIcon />
          //                     {date ? (
          //                       format(date, "PPP")
          //                     ) : (
          //                       <span>Pick a date</span>
          //                     )}
          //                   </Button>
          //                 </PopoverTrigger>
          //                 <PopoverContent className="w-auto p-0" align="start">
          //                   <Calendar
          //                     mode="single"
          //                     selected={date}
          //                     onSelect={setDate}
          //                     initialFocus
          //                   />
          //                 </PopoverContent>
          //               </Popover>
          //             </FormControl>
          //             <FormMessage />
          //           </div>
          //         </FormItem>
          //       )}
          //     />
          //   );
        }
      },
      [form, units]
    );

    const handleSubmit = useCallback(
      (data: any) => {
        console.log(data);
      },
      [onSubmit]
    );
    console.log(fields);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className=" p-4 flex items-center justify-start">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center text-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 hover:border-blue-300 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>
          <div className="grid md:grid-cols-2 bg-neutral-50 gap-4 p-4">
            {fields.map(renderFormField)}
          </div>

          {additionalContent}
          <div className="w-full bg-white bottom-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap rounded-lg bg-slate-900 px-4 py-2 font-medium text-white shadow-xl transition-colors hover:bg-slate-700"
              type="submit"
            >
              Submit
            </motion.button>
          </div>
        </form>
      </Form>
    );
  }
);

export default DynamicFormGenerator;

// Example Usage for Different Forms
export const ItemForm = () => {
  const itemFields: BaseFieldConfig[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: false,
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: false,
    },
    {
      name: "unit",
      label: "Unit",
      type: "popover",
      options: [
        { value: "good", label: "Good" },
        { value: "service", label: "Service" },
      ],
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "radio",
      required: true,
      options: [
        { value: "good", label: "Good" },
        { value: "service", label: "Service" },
      ],
      tooltipContent:
        "Select if this item is a physical good or a service. Remember that you cannot change the type if this item is included in a transaction.",
    },
    {
      name: "stock",
      label: "Opening Stock",
      type: "number",
      required: true,
      tooltipContent: "Initial quantity of the item in inventory",
    },
    {
      name: "price",
      label: "Rate per unit",
      type: "number",
      required: true,
    },
    {
      name: "reorder",
      label: "Reorder Point",
      type: "number",
      required: false,
    },
  ];

  const additionalContent = (
    <div>
      <div className="mt-4 p-4">
        <h3 className="text-2xl font-medium">
          Track Inventory for this item{" "}
          <CustomTooltip
            icon={<CircleHelp className="w-4 h-4" />}
            content="Enable this option to track this item's stock based on its sales and purchase transactions."
          />{" "}
        </h3>
        <p className="font-normal text-neutral-400">
          You cannot enable/disable inventory tracking once you've created
          transactions for this item
        </p>
      </div>
    </div>
  );

  const handleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <DynamicFormGenerator
      fields={itemFields}
      onSubmit={handleSubmit}
      title="Add New Item"
      additionalContent={additionalContent}
    />
  );
};

export const SupplierForm = () => {
  const supplierFields: FieldConfig[] = [
    {
      name: "name",
      label: "Supplier Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      validation: z.string().email("Invalid email address"),
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: "text",
      required: true,
    },
    {
      name: "isPreferred",
      label: "Preferred Supplier",
      type: "checkbox",
      required: false,
    },
  ];

  const handleSupplierSubmit = (data: any) => {
    console.log("Supplier Submitted:", data);
    // Implement your submit logic
  };

  return (
    <DynamicFormGenerator
      fields={supplierFields}
      onSubmit={handleSupplierSubmit}
      title="Add New Supplier"
    />
  );
};
