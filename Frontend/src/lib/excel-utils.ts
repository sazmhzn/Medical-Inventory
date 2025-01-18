import * as XLSX from "xlsx";
import { Supplier } from "types/types";

// Helper function to validate supplier data
const validateSupplierData = (data: Partial<Supplier>): boolean => {
  const requiredFields = [
    "username",
    "name",
    "emailAddress",
    "contact",
    "address",
  ];
  return requiredFields.every((field) => Boolean(data[field]));
};

export const exportToExcel = (data: Supplier[], filename: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((supplier) => ({
        ID: supplier.id,
        Username: supplier.username,
        Name: supplier.name,
        Email: supplier.emailAddress,
        Contact: supplier.contact,
        Address: supplier.address,
        "Created Date": new Date(supplier.createdDate).toLocaleDateString(),
        "Last Updated": new Date(supplier.lastUpdatedDate).toLocaleDateString(),
        "Custom Value": supplier?.customValue || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");

    // Auto-size columns
    const max_width = data.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet["!cols"] = [{ wch: 10 }, { wch: max_width }];

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error("Export failed:", error);
    throw new Error("Failed to export data to Excel");
  }
};

export const importFromExcel = async (
  file: File
): Promise<Partial<Supplier>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const suppliers = jsonData.map((row) => ({
          username: row.Username,
          name: row.Name,
          emailAddress: row.Email,
          password: row.Password,
          orgName: row.OrgName,
          contact: row.Contact,
          address: row.Address,
        }));

        // Validate all suppliers
        const validSuppliers = suppliers.filter(validateSupplierData);

        if (validSuppliers.length !== suppliers.length) {
          reject(new Error("Some records are missing required fields"));
        }

        resolve(validSuppliers);
      } catch (error) {
        reject(new Error("Failed to parse Excel file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
};
