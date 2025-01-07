import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AddCustomField from "./AddCustomField";
import { AlertCircle } from "lucide-react";

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  entityType: string;
}


const CustomFieldManager = ({ entityType, onCustomFieldsChange }) => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load custom fields from localStorage on mount
  useEffect(() => {
    const savedFields = localStorage.getItem(`customFields_${entityType}`);
    if (savedFields) {
      setCustomFields(JSON.parse(savedFields));
    }
  }, [entityType]);

  const handleAddField = (fieldConfig) => {
    const newField = {
      id: crypto.randomUUID(),
      ...fieldConfig,
      entityType,
    };

    const updatedFields = [...customFields, newField];
    setCustomFields(updatedFields);
    localStorage.setItem(
      `customFields_${entityType}`,
      JSON.stringify(updatedFields)
    );
    setShowAddForm(false);

    // Notify parent component about custom fields update
    onCustomFieldsChange(updatedFields);
  };

  const handleRemoveField = (fieldId: string) => {
    const updatedFields = customFields.filter((field) => field.id !== fieldId);
    setCustomFields(updatedFields);
    localStorage.setItem(
      `customFields_${entityType}`,
      JSON.stringify(updatedFields)
    );
    onCustomFieldsChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Custom Fields</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Custom Field"}
        </Button>
      </div>

      {showAddForm && (
        <AddCustomField entityType={entityType} onAddField={handleAddField} />
      )}

      {customFields.length > 0 ? (
        <div className="space-y-4">
          {customFields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{field.label}</p>
                <p className="text-sm text-gray-500">Type: {field.type}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveField(field.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Custom Fields</AlertTitle>
            <AlertDescription>
              Click 'Add Custom Field' to create custom fields for {entityType}.
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
};

export default CustomFieldManager;
