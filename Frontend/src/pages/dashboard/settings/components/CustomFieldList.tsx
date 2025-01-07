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
import { PageHeader } from "../../components/PageHeader";
import {
  CustomFormField,
  deleteCustomForm,
  deleteFields,
  updateFormFields,
  useFetchCustomFormsByEntityType,
} from "@/services/CustomFormAPI";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";

export interface CustomFieldsListProps {
  entityType: "inventory" | "suppliers" | "order";
  formName?: string;
}

export const CustomFieldsList: React.FC<CustomFieldsListProps> = ({
  entityType,
  formName = "inventoryCustomField",
}) => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } =
    useFetchCustomFormsByEntityType(entityType);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

  const handleDelete = async (fieldName: string) => {
    console.log("inside the handle delete");
    try {
      await deleteFields(entityType, formName, [{ name: fieldName }]);
      refetch(); // Refresh the data
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Error deleting the field"
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <PageHeader
        title={getTitle()}
        newButtonLink={`/admin/settings/preferences/${entityType}/add`}
      />

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Default Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((form) =>
              form.formConfig.fields.map((field) => (
                <TableRow key={field.name}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell className="font-medium">{field.label}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{field.type}</Badge>
                  </TableCell>
                  <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                  <TableCell>{field.defaultValue || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(
                            `/admin/settings/preferences/${entityType}/edit/${form.id}`
                          )
                        }
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedField(field.name);
                          setIsDialogOpen(true);
                          handleDelete(field.name);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogHeader>
            <h2>Confirm Deletion</h2>
          </DialogHeader>
          <DialogContent>
            Are you sure you want to delete this custom field? This action
            cannot be undone.
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};
