import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    if (start && end) {
      onDateRangeChange(start.toISOString(), end.toISOString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Filter Type Selector */}
        <div className="w-48">
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Filter Type" />
            </SelectTrigger>
            <SelectContent>
              {availableFilters.map((filter) => (
                <SelectItem key={filter} value={filter}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Input or Date Range Picker */}
        {filterType === "dateRange" ? (
          <DatePickerWithRange
            value={dateRange}
            onChange={({ start, end }) => handleDateChange(start, end)}
          />
        ) : (
          <Input
            type="text"
            value={filterValue}
            onChange={(e) => handleFilterValueChange(e.target.value)}
            placeholder={`Enter ${filterType}...`}
            className="w-64"
          />
        )}

        {/* Run Report Button */}
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
