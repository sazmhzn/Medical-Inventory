import { useParams } from "react-router-dom";
import { GenericTable } from "@/components/GenericTable";
import { useEffect, useState } from "react";
import ReportFilter from "./ReportFilter";
import ReportHeader from "./ReportHeader";

const salesSummaryReport = [
  {
    saleId: 1,
    date: "2024-10-22",
    customerName: "John Doe",
    totalAmount: 35,
    items: [
      { itemId: 1, quantity: 10, price: 5 },
      { itemId: 2, quantity: 5, price: 7 },
    ],
  },
  {
    saleId: 2,
    date: "2024-10-23",
    customerName: "Jane Smith",
    totalAmount: 95,
    items: [
      { itemId: 1, quantity: 15, price: 10 },
      { itemId: 2, quantity: 10, price: 9 },
    ],
  },
];

const inventorySummaryReport = [
  {
    id: "1",
    name: "Surgical Mask",
    stock: 500,
    reorderLevel: 100,
    expiryDate: "2024-10-01",
  },
  {
    id: "2",
    name: "Blood Pressure Monitor",
    stock: 30,
    reorderLevel: 5,
    expiryDate: "N/A",
  },
  // More inventory items...
];

const reportConfig = {
  "sales-by-item": {
    header: "Sales by Item",
    columns: [
      { accessorKey: "name", header: "Item Name" },
      { accessorKey: "quantity", header: "Quantity Sold" },
      { accessorKey: "totalSales", header: "Total Sales" },
    ],
    filters: ["dateRange", "itemCategory"],
  },
  "sales-by-customer": {
    header: "Sales by Customer",
    columns: [
      { accessorKey: "name", header: "Customer Name" },
      { accessorKey: "totalSpent", header: "Total Spent" },
      { accessorKey: "lastPurchase", header: "Last Purchase Date" },
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

export default function GenericReportDisplay() {
  const { reportType } = useParams(); // Fetch the dynamic part of the URL
  const config = reportConfig[reportType] || {}; // Get configuration based on URL
  console.log(config.columns);
  const [filterType, setFilterType] = useState<string>("item");
  const [filterValue, setFilterValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>();
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    let data: any[] = [];
    if (reportType === "sales-by-item") {
      data = salesSummaryReport;
    } else if (reportType === "sales-by-customer") {
      // data = salesSummaryReport.map((sale) => ({
      //   customerName: sale.customerName,
      //   totalAmount: sale.totalAmount,
      //   date: sale.date,
      // }));
      setReportData(salesSummaryReport);
    } else if (reportType === "inventory-summary") {
      // data = inventorySummaryReport.map((item) => ({
      //   name: item.name,
      //   stock: item.stock,
      //   reorderLevel: item.reorderLevel,
      //   expiryDate: item.expiryDate,
      // }));

      setReportData(inventorySummaryReport);
      console.log(reportData);
    }

    // console.log(data, "datais");
    // setFilteredData(data);
  }, [reportType]);

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    setFilterValue(""); // Reset the filter value when the type changes
  };

  const handleFilterValueChange = (value: string) => {
    setFilterValue(value);
  };

  const handleRunReport = () => {
    const newFilteredData = filteredData.filter((row) => {
      if (filterType === "item") {
        return row.name.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (filterType === "customer") {
        return row.customerName
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      return true; // Default case: no filtering
    });

    setFilteredData(newFilteredData);
  };

  if (!config.header) {
    return <p className="text-red-500">Invalid report type.</p>;
  }

  // Example data; replace with API call results.
  const mockData = [
    { name: "Widget A", quantity: 25, totalSales: "$250" },
    { name: "Widget a", quantity: 25, totalSales: "$250" },
    { name: "Widget z", quantity: 25, totalSales: "$250" },
    {
      name: "John Doe",
      totalSpent: "$1,500",
      lastPurchase: "2023-12-01",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <ReportHeader reportName={config.header} />

      {/* Filters section */}
      <ReportFilter
        filterType={filterType}
        filterValue={filterValue}
        handleFilterTypeChange={handleFilterTypeChange}
        handleFilterValueChange={handleFilterValueChange}
        handleRunReport={handleRunReport}
      />

      {/* Table */}
      <GenericTable
        data={reportData}
        columns={config.columns}
        viewMode="Table"
      />
    </div>
  );
}
