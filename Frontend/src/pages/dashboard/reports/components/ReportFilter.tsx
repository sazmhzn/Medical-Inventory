// import { Filter } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// interface ReportFilterProps {
//   filter: string;
//   handleFilterChange: (value: string) => void;
// }

// const ReportFilter = ({ handleFilterChange, filter }: ReportFilterProps) => {
//   return (
//     <div>
//       {/* Filters Section */}
//       <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
//         <label
//           htmlFor="filter"
//           className="mb-2 flex items-center gap-2 text-gray-700 font-medium"
//         >
//           <Filter className="stroke-1 w-4 h-4" /> Filters:
//         </label>
//         <Select onValueChange={handleFilterChange} value={filter}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select" />
//             {/* <SelectValue>{filter}</SelectValue> */}
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="item">Item</SelectItem>
//             <SelectItem value="customer">Customer</SelectItem>
//             <SelectItem value="system">System</SelectItem>
//           </SelectContent>
//         </Select>

//         <Button
//           // onClick={handleRunReport}
//           className=" md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
//         >
//           Run Report
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ReportFilter;

import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "./DatePickerWithRange";

interface ReportFilterProps {
  filterType: string;
  filterValue: string;
  handleFilterTypeChange: (type: string) => void;
  handleFilterValueChange: (value: string) => void;
  handleRunReport: () => void;
  availableFilters: string[];
  onDateRangeChange: (start: string, end: string) => void;
}

const ReportFilter = ({
  filterType,
  filterValue,
  handleFilterTypeChange,
  handleFilterValueChange,
  handleRunReport,
  availableFilters,
  onDateRangeChange,
}: ReportFilterProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onDateRangeChange(start.toISOString(), end.toISOString());
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          {availableFilters.map((filter) => (
            <option key={filter} value={filter}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </option>
          ))}
        </Select>
        <Select value={filterType} onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
            {/* <SelectValue>{filter}</SelectValue> */}
          </SelectTrigger>
          <SelectContent>
            {availableFilters.map((filter) => (
              <SelectItem key={filter} value={filter}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </SelectItem>
            ))}
            <SelectItem value="item">Item</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        {filterType === "dateRange" ? (
          <DatePickerWithRange className="w-auto" />
        ) : (
          <Input
            type="text"
            value={filterValue}
            onChange={(e) => handleFilterValueChange(e.target.value)}
            placeholder={`Enter ${filterType}...`}
            className="w-64"
          />
        )}

        <Button
          onClick={handleRunReport}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Run Report
        </Button>
      </div>
    </div>
  );
};

export default ReportFilter;
