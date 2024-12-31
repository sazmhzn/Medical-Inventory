import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const PreviewField = () => {
  const { watch } = useFormContext();
  const fieldLabel = watch("label") || "Field Label";
  const dataType = watch("dataType") || "text";
  const isRequired = watch("isRequired") === "true";
  const defaultValue = watch("defaultValue") || "";

  const renderPreviewInput = () => {
    switch (dataType) {
      case "text":
      case "email":
        return (
          <Input
            type={dataType}
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
            defaultValue={defaultValue}
            className="w-full"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
            defaultValue={defaultValue}
            className="w-full"
          />
        );
      case "phone":
        return (
          <Input
            type="tel"
            placeholder="xxx-xxx-xxxx"
            defaultValue={defaultValue}
            className="w-full"
          />
        );
      case "select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Input type="date" defaultValue={defaultValue} className="w-full" />
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id="preview-checkbox" />
            <label
              htmlFor="preview-checkbox"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {fieldLabel}
            </label>
          </div>
        );
      default:
        return (
          <Input
            type="text"
            placeholder={`Enter ${fieldLabel.toLowerCase()}`}
            defaultValue={defaultValue}
            className="w-full"
          />
        );
    }
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Field Preview</CardTitle>
        <CardDescription>
          This is how your custom field will appear in the form
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="preview-field">
              {fieldLabel}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderPreviewInput()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
