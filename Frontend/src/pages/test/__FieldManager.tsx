import { Button } from "@/components/ui/button";
import { FieldManagerProps, useFieldManager } from "./__useFieldManager";
import { useEffect } from "react";

// Example usage component
const FieldManager: React.FC<FieldManagerProps> = ({
  defaultFields,
  entityType,
  onFieldsChange,
}) => {

  

  const { allFields, addCustomField, removeCustomField, getFieldsBySection } =
    useFieldManager(defaultFields, entityType);

  // Effect to notify parent of field changes
  useEffect(() => {
    onFieldsChange(allFields);
  }, [allFields, onFieldsChange]);

  return (
    <div className="space-y-6">
      {/* Default Fields Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Fields</h3>
        <div className="grid grid-cols-2 gap-4">
          {getFieldsBySection("default").map((field) => (
            <div
              key={field.name}
              className={`p-4 border rounded-lg ${
                field.gridWidth === "full" ? "col-span-2" : "col-span-1"
              }`}
            >
              <p className="font-medium">{field.label}</p>
              <p className="text-sm text-gray-500">
                Type: {field.type}
                {field.required && " • Required"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Details Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Other Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {getFieldsBySection("other").map((field) => (
            <div
              key={field.name}
              className={`p-4 border rounded-lg ${
                field.gridWidth === "full" ? "col-span-2" : "col-span-1"
              }`}
            >
              <p className="font-medium">{field.label}</p>
              <p className="text-sm text-gray-500">
                Type: {field.type}
                {field.required && " • Required"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Fields Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
        <div className="grid grid-cols-2 gap-4">
          {getFieldsBySection("custom").map((field) => (
            <div
              key={field.name}
              className={`p-4 border rounded-lg ${
                field.gridWidth === "full" ? "col-span-2" : "col-span-1"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{field.label}</p>
                  <p className="text-sm text-gray-500">
                    Type: {field.type}
                    {field.required && " • Required"}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const updated = removeCustomField(field.name);
                    onFieldsChange(updated);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldManager;
