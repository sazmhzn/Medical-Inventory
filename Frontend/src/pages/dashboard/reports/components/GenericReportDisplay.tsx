import { useParams } from "react-router-dom";
import { GenericTable } from "@/components/GenericTable";
import { useEffect, useState, useMemo } from "react";
import ReportFilter from "./ReportFilter";
import ReportHeader from "./ReportHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateCustomReport, useReports } from "@/services/ReportAPI";

// Define proper TypeScript interfaces
interface SaleItem {
  itemId: number;
  quantity: number;
  price: number;
}

interface SaleSummary {
  saleId: number;
  date: string;
  customerName: string;
  totalAmount: number;
  items: SaleItem[];
}

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  reorderLevel: number;
  expiryDate: string;
}

interface ReportConfig {
  header: string;
  columns: Array<{
    accessorKey: string;
    header: string;
  }>;
  filters: string[];
}

interface FilterState {
  type: string;
  value: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export default function GenericReportDisplay() {
  const { reportType } = useParams<{ reportType: string }>();
  const [filterState, setFilterState] = useState<FilterState>({
    type: "item",
    value: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Define report configurations
  const reportConfig: Record<string, ReportConfig> = {
    "sales-by-item": {
      header: "Sales by Item",
      columns: [
        { accessorKey: "saleId", header: "Id" },
        { accessorKey: "name", header: "Item Name" },
        { accessorKey: "quantity", header: "Quantity Sold" },
        { accessorKey: "totalSales", header: "Total Sales" },
      ],
      filters: ["dateRange", "itemCategory"],
    },
    "sales-by-customer": {
      header: "Sales by Customer",
      columns: [
        { accessorKey: "id", header: "Id" },
        { accessorKey: "customerName", header: "Customer Name" },
        { accessorKey: "totalAmount", header: "Total Amount" },
        { accessorKey: "date", header: "Last Purchase Date" },
      ],
      filters: ["dateRange", "customerRegion"],
    },
    "inventory-summary": {
      header: "Inventory Summary",
      columns: [
        { accessorKey: "name", header: "Item Name" },
        { accessorKey: "stock", header: "Stock" },
        { accessorKey: "reorderLevel", header: "Reorder Level" },
        { accessorKey: "expiryDate", header: "Expiry Date" },
      ],
      filters: ["stock", "expiryDate"],
    },
  };

  // Memoize the current report configuration
  const currentConfig = useMemo(() => {
    return reportConfig[reportType || ""] || null;
  }, [reportType]);

  // Fetch report data using TanStack Query hooks
  const {
    data: reportData,
    // isLoading,
    isError,
  } = useReports();

  const handleFilterChange = (type: string, value: string) => {
    setFilterState((prev) => ({
      ...prev,
      type,
      value,
    }));
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setFilterState((prev) => ({
      ...prev,
      dateRange: { start, end },
    }));
  };

  const handleRunReport = () => {
    // refetch({});
  };

  if (!currentConfig) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            Invalid report type. Please select a valid report.
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log(reportData);

  return (
    <div className="space-y-6 p-4">
      <ReportHeader
        reportName="Sales by Item"
        category="Sales"
        onExport={() => console.log("Exporting report")}
        onCsvImport={(data) => console.log("Imported CSV Data:", data)}
      />

      <Card>
        <CardContent className="p-6">
          <ReportFilter
            filterType="dateRange"
            filterValue=""
            handleFilterTypeChange={(type) => console.log("Filter Type:", type)}
            handleFilterValueChange={(value) =>
              console.log("Filter Value:", value)
            }
            handleRunReport={() => console.log("Running Report...")}
            availableFilters={["dateRange", "itemCategory", "customerRegion"]}
            onDateRangeChange={(start, end) =>
              console.log("Date Range:", start, end)
            }
          />

          {/* {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : ( */}
          <GenericTable
            data={reportData || []}
            context="report"
            columns={currentConfig.columns}
            viewMode="Table"
          />
        </CardContent>
      </Card>
    </div>
  );
}
