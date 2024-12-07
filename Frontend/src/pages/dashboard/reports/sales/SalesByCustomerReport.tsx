import { useState } from "react";
import ReportFilter from "../components/ReportFilter";
import ReportHeader from "../components/ReportHeader";

const SalesByCustomerReport = () => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <ReportHeader />
      <ReportFilter handleFilter={handleFilterChange} />
    </div>
  );
};

export default SalesByCustomerReport;
