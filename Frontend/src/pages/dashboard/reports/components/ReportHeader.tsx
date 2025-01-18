import { Button } from "@/components/ui/button";
import { Share1Icon } from "@radix-ui/react-icons";
import { ChevronDown, Filter, History, Settings, X } from "lucide-react";
import { useState } from "react";

interface ReportHeaderProps {
  reportName: string;
  category: string;
  dateRange?: string;
  onRunReport?: () => void;
  onExport?: () => void;
  onCsvImport?: (data: any[]) => void;
}

const ReportHeader = ({
  reportName,
  category,
  dateRange = "From 01 Dec 2024 To 31 Dec 2024",
  onRunReport,
  onExport,
  onCsvImport,
}: ReportHeaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setFile(uploadedFile || null);
  };

  const handleCsvImport = async () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const text = event.target?.result as string;
      const csvData = parseCsvToArray(text);
      if (onCsvImport) {
        onCsvImport(csvData);
      }
    };
    fileReader.readAsText(file);
  };

  const parseCsvToArray = (csvText: string): any[] => {
    const [headerRow, ...dataRows] = csvText.split("\n").map((row) => row.split(","));
    return dataRows.map((row) =>
      headerRow.reduce((acc, header, index) => {
        acc[header.trim()] = row[index]?.trim() || "";
        return acc;
      }, {} as Record<string, string>)
    );
  };

  return (
    <div className="mx-4 my-6">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex flex-col">
          <p className="font-normal text-gray-600">{category}</p>
          <h4 className="text-neutral-800 font-semibold text-xl">
            {reportName}
          </h4>
          <span className="font-normal text-neutral-600 text-sm">{dateRange}</span>
        </div>

        <div className="flex gap-2 items-center">
          {/* Settings Button */}
          <Button
            size="icon"
            variant="secondary"
            className="bg-gray-200 border border-gray-300 text-black"
          >
            <Settings />
          </Button>

          {/* History and Share Buttons */}
          <div className="flex">
            <Button
              size="icon"
              variant="secondary"
              className="bg-gray-200 border border-gray-300 rounded-none rounded-l-lg text-black"
            >
              <History />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-gray-200 border border-gray-300 rounded-none rounded-r-lg text-black"
            >
              <Share1Icon />
            </Button>
          </div>

          {/* Export Button */}
          {onExport && (
            <Button
              onClick={onExport}
              className="bg-gray-200 border border-gray-300 text-black"
            >
              Export
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          )}

          {/* Close Button */}
          <Button
            size="icon"
            variant="link"
            className="text-red-600"
          >
            <X />
          </Button>

          {/* CSV Import Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCsvImport();
            }}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline">Import CSV</Button>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
