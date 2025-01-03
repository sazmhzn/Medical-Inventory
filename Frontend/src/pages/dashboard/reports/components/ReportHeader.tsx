import { Button } from "@/components/ui/button";
import { Share1Icon } from "@radix-ui/react-icons";
import { ChevronDown, Filter, History, Settings, XIcon } from "lucide-react";
import { useState } from "react";

const ReportHeader = ({
  reportName = "sales by Item",
  category = "Sales",

}) => {
  const handleRunReport = () => {
    // Logic to run the report based on selected filters and dates
    console.log("Running report with:");
  };

  const handleExport = () => {
    // Logic to export the report
    console.log("Exporting report");
  };

  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows
      .map((row) => {
        const values = row.split(",");
        if (values.length !== csvHeader.length) return null; // Handle incomplete rows
        return csvHeader.reduce((object, header, index) => {
          object[header.trim()] = values[index].trim();
          return object;
        }, {});
      })
      .filter(Boolean); // Filter out invalid rows

    onCsvImport(array); // Pass data back to the parent
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  return (
    <div className="mx-4 my-6">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex flex-col ">
          <p className="font-normal">{category}</p>
          <div className="text-neutral-600">
            <h4 className="text-neutral-800 font-semibold text-xl">
              {reportName}
              <span className="font-normal text-neutral-800 text-xs">
                From 01 Dec 2034 To 31 Dec 2024
              </span>
            </h4>
          </div>
        </div>
        <div className="flex gap-2">
          {/* This is drawer */}
          <Button
            size={"icon"}
            variant="secondary"
            className="px-4 bg-gray-200 border border-gray-300 shadow-none py-1 font-normal text-black rounded-lg transition duration-300"
          >
            <Settings />
          </Button>
          <div>
            <Button
              size={"icon"}
              variant="secondary"
              className="px-4 bg-gray-200 border border-gray-300 shadow-none py-1 font-normal text-black rounded-none rounded-s-lg transition duration-300"
            >
              <History />
            </Button>
            <Button
              size={"icon"}
              variant="secondary"
              className="px-4 bg-gray-200 border border-gray-300 shadow-none py-1 font-normal text-black rounded-none rounded-e-lg transition duration-300"
            >
              <Share1Icon />
            </Button>
          </div>

          <Button
            onClick={handleExport}
            className="px-4 bg-gray-200 border border-gray-300 shadow-none py-1 font-normal text-black rounded-lg transition duration-300"
          >
            Export
            <ChevronDown />
          </Button>
          <Button
            onClick={handleExport}
            variant="link"
            size="icon"
            className="px-4 py-1 text-white rounded-lg transition duration-300"
          >
            <XIcon className="w-6 h-6 stroke-red-600" />
          </Button>

          <form>
            <input
              type="file"
              onChange={() => {
                {
                  handleOnChange;
                }
              }}
              accept=".csv"
            />
            <Button
              variant="outline"
              type="submit"
              onClick={() => {
                {
                  handleOnSubmit;
                }
              }}
            >
              Import CSV
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
