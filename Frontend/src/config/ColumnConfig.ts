// src/config/ReportColumns.ts
import { ColumnDef } from "@tanstack/react-table";

export const reportColumns: Record<string, ColumnDef<any>[]> = {
  "sales-by-customer": [
    { accessorKey: "customerName", header: "Customer Name" },
    { accessorKey: "invoiceCount", header: "Invoice Count" },
    { accessorKey: "sales", header: "Sales" },
    { accessorKey: "salesWithTax", header: "Sales with Tax" },
  ],
  "sales-by-item": [
    { accessorKey: "itemName", header: "Item Name" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "quantitySold", header: "Quantity Sold" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "averagePrice", header: "Average Price" },
  ],
};
