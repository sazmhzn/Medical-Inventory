import { toast } from "@/hooks/use-toast";

export const handleExport = (data, fileName, headers, dataMapper) => {
  if (!data || data.length === 0) {
    toast({
      title: "Export Failed",
      description: `No ${fileName} data available to export`,
      variant: "destructive",
    });
    return;
  }

  // Generate CSV data
  const csvData = data.map(dataMapper);

  // Prepare CSV content
  const csvContent = [
    headers.join(","), // Add headers as the first row
    ...csvData.map((row) => row.join(",")), // Add each mapped row
  ].join("\n");

  // Create a Blob for the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a temporary link to download the file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  // Show success toast
  toast({
    title: "Export Successful",
    description: `${fileName} data has been exported to CSV`,
  });
};
