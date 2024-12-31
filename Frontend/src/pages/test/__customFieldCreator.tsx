import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { useState } from "react";
import { FieldConfig } from "../dashboard/components/DynamicFormGenerator";
import { Button } from "@/components/ui/button";

export const CustomFieldCreator = ({
  onAddField,
}: {
  onAddField: (field: FieldConfig) => void;
}) => {
  const [newField, setNewField] = useState<Partial<FieldConfig>>({
    name: "",
    label: "",
    type: "text",
  });

  const handleAddField = () => {
    if (!newField.name || !newField.label) {
      alert("Name and Label are required!");
      return;
    }

    onAddField({
      ...newField,
      required: false, // Default
      validation: {}, // Default empty validation
    } as FieldConfig);
    setNewField({ name: "", label: "", type: "text" }); // Reset
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Field Name"
        value={newField.name}
        onChange={(e) =>
          setNewField((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <Input
        placeholder="Field Label"
        value={newField.label}
        onChange={(e) =>
          setNewField((prev) => ({ ...prev, label: e.target.value }))
        }
      />
      <Select
        onValueChange={(value) =>
          setNewField((prev) => ({ ...prev, type: value }))
        }
        defaultValue="text"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="select">Select</SelectItem>
          <SelectItem value="checkbox">Checkbox</SelectItem>
          <SelectItem value="radio">Radio</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleAddField}>Add Field</Button>
    </div>
  );
};
