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

interface ReportFilterProps {
  filterType: string; // Current selected filter type
  filterValue: string; // Current filter input value
  handleFilterTypeChange: (value: string) => void; // Function to set filter type
  handleFilterValueChange: (value: string) => void; // Function to set filter value
  handleRunReport: () => void; // Function to trigger the filtering logic
}

const ReportFilter = ({
  filterType,
  handleFilterTypeChange,
  handleRunReport,
}: ReportFilterProps) => {
  return (
    <div>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
        <label
          htmlFor="filter"
          className="mb-2 flex items-center gap-2 text-gray-700 font-medium"
        >
          <Filter className="stroke-1 w-4 h-4" /> Filters:
        </label>

        {/* Filter Type Selector */}
        <Select onValueChange={handleFilterTypeChange} value={filterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item">Item</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        {/* Run Report Button */}
        <Button
          onClick={handleRunReport}
          className=" md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Run Report
        </Button>
      </div>
    </div>
  );
};

export default ReportFilter;
