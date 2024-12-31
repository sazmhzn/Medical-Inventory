import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomField } from "types/customFields";
import { PageHeader } from "../../components/PageHeader";

interface CustomFieldsListProps {
  entityType: "inventory" | "suppliers" | "order";
}

export const CustomFieldsList: React.FC<CustomFieldsListProps> = ({
  entityType,
}) => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<CustomField[]>([]);

  // Fetch fields from localStorage or API
  useEffect(() => {
    const savedFields = localStorage.getItem(`customFields_${entityType}`);
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  }, [entityType]);

  const getTitle = () => {
    switch (entityType) {
      case "inventory":
        return "Inventory Custom Fields";
      case "suppliers":
        return "Suppliers Custom Fields";
      case "order":
        return "Order Custom Fields";
    }
  };

  return (
    <div className="p-4">
      <PageHeader
        title={getTitle()}
        mode="list"
        newButtonLink={`/admin/settings/preferences/${entityType}/add`}
      />

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Default Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.label}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{field.dataType}</Badge>
                </TableCell>
                <TableCell>{field.isRequired ? "Yes" : "No"}</TableCell>
                <TableCell>{field.defaultValue || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(
                          `/admin/settings/preferences/${entityType}/edit/${field.id}`
                        )
                      }
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => handleDelete(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
