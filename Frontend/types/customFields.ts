export interface CustomField {
  id: string;
  label: string;
  dataType:
    | "text"
    | "number"
    | "email"
    | "phone"
    | "select"
    | "date"
    | "checkbox";
  isRequired: boolean;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  entityType: "inventory" | "customer" | "order";
}
