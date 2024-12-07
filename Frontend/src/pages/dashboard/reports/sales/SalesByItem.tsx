import { useEffect, useState } from "react";
import ReportFilter from "../components/ReportFilter";
import ReportHeader from "../components/ReportHeader";

const SalesByItem = () => {
  const [filter, setFilter] = useState("Per"); //+

  const handleFilterChange = (value: string) => {
    console.log("Selected Filter:", value);
    // setFilter(value);
  };

  return (
    <div>
      <ReportHeader />
      <ReportFilter filter={filter} handleFilterChange={handleFilterChange} />
    </div>
  );
};

export default SalesByItem;
