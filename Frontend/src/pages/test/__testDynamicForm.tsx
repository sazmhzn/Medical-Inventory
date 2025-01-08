import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTooltip from "@/components/ToolTipAlert";
import { AlertCircle, CheckCircle2, CircleHelp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

// Field configuration types
type BaseFieldConfig = {
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
};

type SelectFieldConfig = BaseFieldConfig & {
  type: "select" | "radio";
  options: { value: string; label: string }[];
};

type FileFieldConfig = BaseFieldConfig & {
  type: "file";
  validation?: {
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    message?: string;
  };
};

export type FieldConfig =
  | BaseFieldConfig
  | SelectFieldConfig
  | (FileFieldConfig & {
      section: "default" | "other"; // Add section property
    });

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, any>) => void;
  title?: string;
  isCustomField?: boolean;
  additionalContent?: React.ReactNode;
  context: string;
  initialValues?: Record<string, any>; // Add this line
  isLoading?: boolean;
}

// Example input component with phone formatting
const PhoneInputField = memo(({ field, form, config }: any) => {
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    field.onChange(value);
  };

  return (
    <FormItem>
      <FormLabel>
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          {...field}
          type="tel"
          value={formatPhoneNumber(field.value || "")}
          onChange={handleChange}
          placeholder="xxx-xxx-xxxx"
          maxLength={12}
          className="bg-white"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

// Memoized field components
const InputField = memo(({ field, form, config }: any) => (
  <FormItem>
    <FormLabel>
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </FormLabel>
    <FormControl>
      <Input
        {...field}
        type={config.type}
        placeholder={`Enter ${config.label.toLowerCase()}`}
      />
    </FormControl>
    <FormMessage />
  </FormItem>
));

const SelectField = memo(({ field, form, config }: any) => (
  <FormItem>
    <FormLabel>
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger className="h-12">
          <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {config.options.map((option: any) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
));

const RadioField = memo(({ field, form, config, tooltipContent }: any) => (
  <FormItem className=" space-y-2">
    <FormLabel className="mb-2 flex items-center">
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
      {config.tooltipContent && (
        <CustomTooltip
          icon={<CircleHelp className=" w-4 h-4 ml-1" />}
          content={config.tooltipContent}
        />
      )}
    </FormLabel>
    <FormControl>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="flex items-center content-center gap-4"
      >
        {config.options.map((option: any) => (
          <div
            key={option.value}
            className="flex items-center space-x-2  cursor-pointer"
          >
            <RadioGroupItem id={option.label} value={option.value} />
            <FormLabel
              htmlFor={option.label}
              className="font-normal  cursor-pointer"
            >
              {option.label}
            </FormLabel>
          </div>
        ))}
      </RadioGroup>
    </FormControl>
    <FormMessage />
  </FormItem>
));

const CheckboxField = memo(({ field, form, config }: any) => (
  <FormItem className=" flex items-center space-x-2 space-y-0">
    <FormControl>
      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
    </FormControl>

    <FormLabel className="font-normal space-y-0">
      {config.label}
      {config.required && <span className="ml-1">*</span>}
    </FormLabel>
    <FormMessage />
  </FormItem>
));

// New Date Field Component
const DateField = memo(({ field, form, config }: any) => {
  return (
    <FormItem>
      <FormLabel>
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          {...field}
          type="date"
          value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
          onChange={(e) => {
            field.onChange(e.target.value);
          }}
          className="bg-white"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

// New File upload component

// File upload component with BLOB handling
const FileField = memo(({ field, form, config }: any) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const compressImage = async (
    base64String: string,
    maxSizeKB: number = 200
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 800; // Maximum width or height
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // Adjust quality until size is under maxSizeKB
        let quality = 0.7;
        let compressedBase64 = canvas.toDataURL("image/jpeg", quality);

        while (compressedBase64.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(compressedBase64);
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) return;

    // Validate file type
    const acceptedTypes = config.validation?.acceptedFileTypes || [
      ".jpg",
      ".jpeg",
      ".png",
    ];

    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!acceptedTypes.includes(fileExtension)) {
      setFileError(
        `Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`
      );
      return;
    }

    // Validate file size
    const maxSize = config.validation?.maxFileSize || 5 * 1024 * 1024; // 5MB default
    if (file.size > maxSize) {
      setFileError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Create preview URL and store in localStorage
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64String = e.target?.result as string;

      try {
        // Compress image before storing
        const compressedImage = await compressImage(base64String);
        setPreview(compressedImage);
        localStorage.setItem("storedImage", compressedImage);
        localStorage.setItem("storedFileName", file.name);
        setFileName(file.name);
        field.onChange(compressedImage);
      } catch (error) {
        console.error("Error compressing image:", error);
        setFileError("Error processing image");
      }
    };
    reader.readAsDataURL(file);

    // Store the file in form
    // field.onChange(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Convert to Blob
    const blob = new Blob([file], { type: file.type });
    field.onChange(blob);
  };

  const handleDownload = () => {
    if (preview && fileName) {
      const link = document.createElement("a");
      link.href = preview;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    setFileError(null);
    field.onChange(null);
    localStorage.removeItem("storedImage");
    localStorage.removeItem("storedFileName");
  };

  return (
    <FormItem>
      <FormLabel>
        {config.label}
        {config.required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <div className="space-y-2">
          <Input
            type="file"
            accept={config.validation?.acceptedFileTypes?.join(",")}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
          {fileError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )}
          {preview && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Download File
                </Button>
                <Button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Clear File
                </Button>
              </div>

              {preview.startsWith("data:image") && (
                <div className="mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-[200px] max-h-[200px] object-contain"
                  />
                </div>
              )}

              <div className="text-sm text-gray-600">File name: {fileName}</div>
            </div>
          )}

          {field.value && !preview && (
            <div className="text-sm text-gray-600">
              File selected: {(field.value.size / 1024).toFixed(2)} KB
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

const DynamicFormGenerator: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  title,
  isCustomField = false,
  context,
  additionalContent,
  initialValues,
  isLoading,
}) => {
  const getGridClass = (width?: string) => {
    switch (width) {
      case "full":
        return "md:col-span-2";
      case "half":
        return "col-span-1";
      case "third":
        return "col-span-1 md:col-span-1";
      default:
        return "col-span-2 md:col-span-1"; // Default to half width on medium screens
    }
  };

  const fieldConfig = [
    {
      context: "inventory",
      defaultFields: [
        "name",
        "type",
        "sku",
        "category",
        "unit",
        "price",
        "inStock",
        "image",
        "expiryDate",
      ],
      otherFields: [
        "manufacturer",
        "batchNumber",
        "storageConditions",
        "description",
        "stock",
        "reorder",
        "createdDate",
        "lastUpdatedDate",
      ],
    },
    {
      context: "supplier",
      defaultFields: [
        "type",
        "name",
        "displayName",
        "email",
        "phoneWork",
        "phonePersonal",
        "isPreferred",
        "price",
      ],
      otherFields: ["document"],
    },
    {
      context: "order",
      defaultFields: [
        "supplierId",
        "companyName",
        "salesOrder",
        "salesOrderDate",
        "shipmentDate",
        "paymentTerms",
      ],
      otherFields: [""],
    },
  ];

  const config = fieldConfig.find((item) => item.context === context);

  const defaultFields = fields.filter((field) => field.section === "default");

  const otherDetails = fields.filter((field) => field.section === "other");

  const customFields = fields.filter((field) => field.section === "custom");

  const combinedFields = [
    ...defaultFields,
    ...otherDetails,
    ...customFields, // Custom fields added dynamically
  ];

  // Memoize schema generation
  const formSchema = useMemo(() => {
    const generateSchema = (field: FieldConfig[]) => {
      const schemaFields: { [key: string]: z.ZodType } = {};

      combinedFields.forEach((field) => {
        let fieldValidation: z.ZodType;
        if (field.type === "file") {
          // File field validation
          fieldValidation = z
            // .instanceof(Blob)
            .string()
            .optional()
            .refine((value) => {
              if (field.required && !value) return false;
              return true;
            }, "File is required");
        } else {
          // Existing validation logic
          if (field.required) {
            switch (field.type) {
              case "text":
                fieldValidation = z
                  .string()
                  .min(1, `${field.label}  is required`);
                break;
              case "number":
                fieldValidation = z.coerce
                  .number()
                  .min(0, `${field.label} must be a positive number`);
                break;
              case "select":
              case "radio":
                fieldValidation = z
                  .string()
                  .nonempty(`${field.label} is required`);
                break;
              case "checkbox":
                fieldValidation = z.boolean();
                break;
              case "tel":
                fieldValidation = z.coerce
                  .number()
                  .min(10, "min 10")
                  .optional();
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
                fieldValidation = z.coerce.number().optional();
                break;
              case "tel":
                fieldValidation = z.coerce
                  .number()
                  .min(10, "min 10")
                  .optional();
                break;
              case "select":
              case "radio":
                fieldValidation = z.string().optional();
                break;
              case "checkbox":
                fieldValidation = z.boolean().optional();
                break;
              default:
                fieldValidation = z.string().optional();
            }
          }
        }

        schemaFields[field.name] = fieldValidation;
      });

      return z.object(schemaFields);
    };

    return generateSchema(combinedFields);
  }, [combinedFields, customFields]);

  // Memoize default values
  const defaultValues = useMemo(() => {
    const defaults: { [key: string]: any } = {};

    combinedFields.forEach((field) => {
      // If we have initial values, use them
      if (initialValues && initialValues[field.name] !== undefined) {
        defaults[field.name] = initialValues[field.name];

        return;
      }

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
  }, [fields, initialValues]);

  const renderField = (field: FieldConfig) => {
    return (
      <div key={field.name} className={getGridClass(field.gridWidth)}>
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => {
            const props = {
              field: formField,
              form,
              config: field,
            };

            switch (field.type) {
              case "date":
                return <DateField {...props} />;
              case "select":
                return <SelectField {...props} />;
              case "radio":
                return <RadioField {...props} />;
              case "checkbox":
                return <CheckboxField {...props} />;
              case "file":
                return <FileField {...props} />;
              case "tel":
                return <PhoneInputField {...props} />;
              default:
                return <InputField {...props} />;
            }
          }}
        />
      </div>
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  return (
    <div className="">
      {/* Form Container */}
      <div className="pt-6 bg-white rounded-lg shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <div className="px-4">
              {/* Default Fields */}
              <div className="w-1/2">
                {title && <h2 className="text-md font-medium mb-4">{title}</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {defaultFields.map(renderField)}
                </div>
              </div>

              {additionalContent}

              <Tabs defaultValue="Other Details" className="w-full">
                <TabsList className="flex justify-start gap-4 border-b">
                  <TabsTrigger className="p-2" value="Other Details">
                    Other Details
                  </TabsTrigger>
                  {!isCustomField && (
                    <TabsTrigger className="p-2" value="Custom Fields">
                      Custom Fields
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="Other Details">
                  {/* Other Details */}
                  {otherDetails.length > 0 && (
                    <div className="w-1/2">
                      <p className="mb-4">
                        {" "}
                        Make changes to your account here.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherDetails.map(renderField)}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="Custom Fields">
                  {/* Custom Fields */}
                  {customFields.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Custom Fields
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {customFields.map(renderField)}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Section */}
            <div className="w-full sticky bottom-0 bg-neutral-100 border-t border-neutral-200 mt-8 p-4 flex justify-end gap-2">
              <motion.Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                variant="secondary"
              >
                Save as Draft
              </motion.Button>
              <Button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-slate-900 px-4 py-2 font-medium text-white shadow-xl transition-colors hover:bg-slate-700"
              >
                Save and Send
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DynamicFormGenerator;
