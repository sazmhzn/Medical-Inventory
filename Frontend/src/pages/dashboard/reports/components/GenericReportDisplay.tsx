import React, { useEffect, useState, useMemo } from "react";
import { GenericTable } from "@/components/GenericTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReports } from "@/services/ReportAPI";
import { Download, Filter } from "lucide-react";
import { DateRangePicker } from "../../components/DateRangePicker";

// TypeScript interfaces
interface PurchaseOrderItem {
  "Item Name": string;
  "Total Price": number;
  Quantity: number;
  "Price Per Unit": number;
}

interface PurchaseOrder {
  Status: "DELIVERED" | "SHIPPED" | "ACCEPTED";
  "Supplier Name": string;
  "Order ID": number;
  "Supplier Organization": string;
  "Supplier Contact": string;
  "Order Date": string;
  Items: PurchaseOrderItem[];
  "Total Amount": number;
  "Last Updated Date": string;
}

interface FilterState {
  status: string;
  supplier: string;
  dateRange: {
    start: Date | undefined;
    end: Date | undefined;
  };
}

export default function PurchaseOrderReport() {
  const [filterState, setFilterState] = useState<FilterState>({
    status: "all",
    supplier: "all",
    dateRange: {
      start: undefined,
      end: undefined,
    },
  });

  const { data: reportData, isLoading } = useReports();

  // Define columns for GenericTable
  const columns = [
    {
      accessorKey: "Order ID",
      header: "Order ID",
      cell: (info: any) => `#${info.getValue()}`,
    },
    {
      accessorKey: "Status",
      header: "Status",
      cell: (info: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            info.getValue()
          )}`}
        >
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "Supplier Organization",
      header: "Supplier",
      cell: (info: any) => (
        <div>
          <div className="font-medium">{info.getValue()}</div>
          <div className="text-sm text-gray-500">
            {info.row.original["Supplier Name"]}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "Order Date",
      header: "Order Date",
      cell: (info: any) => formatDate(info.getValue()),
    },
    {
      accessorKey: "Items",
      header: "Items",
      cell: (info: any) => (
        <div>
          {info.getValue().map((item: PurchaseOrderItem, index: number) => (
            <div key={index} className="text-sm">
              {item["Item Name"]} ({item.Quantity}x)
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "Total Amount",
      header: "Total Amount",
      cell: (info: any) => formatCurrency(info.getValue()),
    },
    {
      accessorKey: "Last Updated Date",
      header: "Last Updated",
      cell: (info: any) => formatDate(info.getValue()),
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: PurchaseOrder["Status"]) => {
    const colors = {
      DELIVERED: "bg-green-100 text-green-800",
      SHIPPED: "bg-blue-100 text-blue-800",
      ACCEPTED: "bg-yellow-100 text-yellow-800",
    };
    return colors[status];
  };

  // Filter data based on current filter state
  const filteredData = useMemo(() => {
    if (!reportData) return [];

    return (reportData as PurchaseOrder[]).filter((order) => {
      const matchesStatus =
        filterState.status === "all" || order.Status === filterState.status;
      const matchesSupplier =
        filterState.supplier === "all" ||
        order["Supplier Organization"] === filterState.supplier;
      const inDateRange =
        !filterState.dateRange.start ||
        !filterState.dateRange.end ||
        (new Date(order["Order Date"]) >= filterState.dateRange.start &&
          new Date(order["Order Date"]) <= filterState.dateRange.end);

      return matchesStatus && matchesSupplier && inDateRange;
    });
  }, [reportData, filterState]);

  // Get unique supplier organizations for filter
  const supplierOptions = useMemo(() => {
    if (!reportData) return [];
    const suppliers = new Set(
      (reportData as PurchaseOrder[]).map(
        (order) => order["Supplier Organization"]
      )
    );
    return Array.from(suppliers);
  }, [reportData]);

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredData.length) return;

    const headers = Object.keys(filteredData[0]).join(",");
    const rows = filteredData.map((order) => {
      const row = { ...order };
      row.Items = JSON.stringify(order.Items); // Handle nested Items array
      return Object.values(row).join(",");
    });

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchase_orders_report.csv";
    a.click();
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Orders Report</h1>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select
              value={filterState.status}
              onValueChange={(value) =>
                setFilterState((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterState.supplier}
              onValueChange={(value) =>
                setFilterState((prev) => ({ ...prev, supplier: value }))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {supplierOptions.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateRangePicker
              from={filterState.dateRange.start}
              to={filterState.dateRange.end}
              onSelect={(range) =>
                setFilterState((prev) => ({
                  ...prev,
                  dateRange: {
                    start: range?.from,
                    end: range?.to,
                  },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : (
            <GenericTable
              data={filteredData}
              columns={columns}
              searchField="supplierName"
              context="report"
              viewMode="Table"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
